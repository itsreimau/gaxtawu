const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const userJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? (await ctx.core.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET))[0].lid : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!userJid || !coinAmount) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)} 8`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        const userDb = ctx.db.user;

        if (ctx.citation.isOwner) return await ctx.reply(formatter.quote("❎ Koin tak terbatas tidak dapat ditransfer."));
        if (coinAmount <= 0) return await ctx.reply(formatter.quote("❎ Jumlah koin tidak boleh kurang dari atau sama dengan 0!"));
        if (userDb?.coin < coinAmount) return await ctx.reply(formatter.quote("❎ Koin Anda tidak mencukupi untuk transfer ini!"));

        try {
            const anotherUserDb = ctx.getDb("users", userJid);
            anotherUserDb.coin += coinAmount;
            userDb.coin -= coinAmount;
            anotherUserDb.save();
            userDb.save();

            await ctx.reply(formatter.quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};