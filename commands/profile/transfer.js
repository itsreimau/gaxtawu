const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const userJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || (ctx.args[0] ? await ctx.convertJid(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET, "lid") : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!userJid && !coinAmount) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0 8"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        const senderId = ctx.getId(ctx.sender.lid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.cmd.isOwner(ctx.getId(ctx.sender.jid), ctx.msg.key.id) || userDb?.premium) return await ctx.reply(formatter.quote("❎ Koin tak terbatas tidak dapat ditransfer."));
        if (coinAmount <= 0) return await ctx.reply(formatter.quote("❎ Jumlah koin tidak boleh kurang dari atau sama dengan 0!"));
        if (userDb?.coin < coinAmount) return await ctx.reply(formatter.quote("❎ Koin Anda tidak mencukupi untuk transfer ini!"));

        try {
            await db.add(`user.${ctx.getId(userJid)}.coin`, coinAmount);
            await db.subtract(`user.${senderId}.coin`, coinAmount);

            await ctx.reply(formatter.quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};