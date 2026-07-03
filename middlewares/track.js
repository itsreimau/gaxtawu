// Middleware untuk tracking
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        // Tracking XP pengguna
        const senderDb = ctx.db.user;
        const xpGain = 10;
        const xpToLevelUp = 100;
        let newSenderXp = (senderDb?.xp || 0) + xpGain;
        if (newSenderXp >= xpToLevelUp) {
            const senderLevel = senderDb?.level || 0;
            let newSenderLevel = senderLevel + 1;
            newSenderXp -= xpToLevelUp;
            senderDb.xp = newSenderXp;
            senderDb.level = newSenderLevel;
        } else {
            senderDb.xp = newSenderXp;
        }
        senderDb.save();

        // Tracking pesan untuk top sider/yapping
        if (ctx.isGroup() && !ctx.msg.key.fromMe) {
            const groupDb = ctx.db.group;
            let members = groupDb?.members || [];

            const senderLid = ctx.sender.lid;
            const existingMember = members.find(x => tools.cmd.areJidsSameUser(x.id, senderLid));

            if (existingMember) {
                existingMember.sent = (existingMember.sent || 0) + 1;
                if (ctx.sender.pushName) existingMember.pushName = ctx.sender.pushName;
            } else {
                const groupMembers = await ctx.group().members();
                const memberData = groupMembers.find(x => tools.cmd.areJidsSameUser(x.id, senderLid));
                members.push({
                    id: senderLid,
                    sent: 1,
                    pushName: ctx.sender.pushName
                });
            }

            groupDb.members = members;
            groupDb.save();
        }

        await next();
    });
};