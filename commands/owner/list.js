module.exports = [{
    name: "listbanuser",
    aliases: ["listban", "listbanned", "listbanneduser"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getMany(user => user.banned);
            const bannedUsers = [];

            for (const user of users) bannedUsers.push(user.jid);

            let resultText = "";
            let userMentions = [];

            for (const bannedUser of bannedUsers) {
                const userId = ctx.getId(bannedUser);
                resultText += `❖ @${userId}\n`;
                userMentions.push(bannedUser);
            }

            await ctx.reply({
                text: resultText.trim() || tools.msg.info(config.msg.notFound),
                mentions: userMentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
}, {
    name: "listpremiumuser",
    aliases: ["listprem", "listpremium"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getMany(user => user.premium);
            const premiumUsers = [];

            for (const user of users)
                premiumUsers.push({
                    jid: user.jid,
                    expiration: user.premiumExpiration
                });

            let resultText = "";
            let userMentions = [];

            for (const user of premiumUsers) {
                const premiumUser = user.jid;
                const userId = ctx.getId(user.jid);
                userMentions.push(premiumUser);

                if (user.expiration) {
                    const timeDiff = user.expiration - Date.now();
                    const daysLeft = tools.msg.convertMsToDuration(timeDiff, ["hari", "jam"]);
                    resultText += `❖ @${userId} (${daysLeft} tersisa)\n`;
                } else {
                    resultText += `❖ @${userId} (Permanen)\n`;
                }
            }

            await ctx.reply({
                text: resultText.trim() || tools.msg.info(config.msg.notFound),
                mentions: userMentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
    }, {
    name: "listsewagroup",
    aliases: ["listsewa"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const groups = ctx.db.groups.getMany(group => group.sewa);
            const sewaGroups = [];

            for (const group of groups)
                sewaGroups.push({
                    jid: group.jid,
                    expiration: group.sewaExpiration
                });

            let resultText = "";
            let groupMentions = [];

            for (const group of sewaGroups) {
                const groupJid = group.jid;
                const groupSubject = await ctx.group(groupJid).name();

                groupMentions.push({
                    groupJid,
                    groupSubject
                });

                if (group.expiration) {
                    const timeDiff = group.expiration - Date.now();
                    const daysLeft = tools.msg.convertMsToDuration(timeDiff, ["hari", "jam"]);
                    resultText += `❖ @${groupJid} (${daysLeft} tersisa)\n`;
                } else {
                    resultText += `❖ @${groupJid} (Permanen)\n`;
                }
            }

            await ctx.reply({
                text: resultText.trim() || tools.msg.info(config.msg.notFound),
                contextInfo: {
                    groupMentions
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
}];