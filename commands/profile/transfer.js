const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const userJid = ctx.quoted?.senderJid || ctx.getMentioned()[0] || (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted?.senderJid ? 0 : 1], 10) || null;

        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);

        if (!userJid && !coinAmount) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${senderId} 8`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(formatter.quote("❎ Akun tidak ada di WhatsApp!"));

        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.cmd.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(formatter.quote("❎ Koin tak terbatas tidak dapat ditransfer."));
        if (coinAmount <= 0) return await ctx.reply(formatter.quote("❎ Jumlah koin tidak boleh kurang dari atau sama dengan 0!"));
        if (userDb?.coin < coinAmount) return await ctx.reply(formatter.quote("❎ Koin-mu tidak mencukupi untuk transfer ini!"));

        try {
            await db.add(`user.${ctx.getId(userJid)}.coin`, coinAmount);
            await db.subtract(`user.${senderId}.coin`, coinAmount);

            await ctx.reply(formatter.quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};