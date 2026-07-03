const { Cooldown } = require("@itsreimau/gktw");

// Middleware untuk pengecekan mode dan mute
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();
        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? ctx.getId(groupJid) : null;
        const isOwner = ctx.sender.isOwner();
        const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

        // Mengambil database
        const botDb = ctx.db.bot;
        const senderDb = ctx.db.user;
        const groupDb = ctx.db.group;

        if (!senderDb || !groupDb) return;

        // Pengecekan mode bot (group, private, self)
        if (botDb?.mode === "premium" && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
        if (botDb?.mode === "self" && !isOwner) return;

        // Pengecekan mute pada grup
        if (groupDb?.mutebot && !(isOwner || isAdmin) && !(ctx.used.command === "unmute" && ctx.args[0]?.toLowerCase() === "bot")) return;
        const muteList = groupDb?.mute || [];
        if (muteList.some(mute => mute.jid === ctx.sender.lid)) return;

        // Log command masuk
        if (isGroup && !ctx.msg.key.fromMe && ctx.prefix !== "force") {
            console.log(`Incoming command: ${ctx.used.command}, from group: ${groupId}, by: ${senderId}`);
        } else if (isPrivate && !ctx.msg.key.fromMe) {
            console.log(`Incoming command: ${ctx.used.command}, from: ${senderId}`);
        }

        await next();
    });
};