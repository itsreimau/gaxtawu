module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    ctx.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        const senderDb = ctx.db.user;

        if (ctx.sender.isOwner() || senderDb?.premium) return await ctx.reply(ctx.msg.info("Koin tak terbatas tidak dapat ditransfer."));
        if (coinAmount <= 0) return await ctx.reply(ctx.msg.info("Jumlah koin tidak boleh kurang dari atau sama dengan 0!"));
        if (senderDb?.coin < coinAmount) return await ctx.reply(ctx.msg.info("Koin Anda tidak mencukupi untuk transfer ini!"));

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.coin += coinAmount;
            senderDb.coin -= coinAmount;
            targetDb.save();
            senderDb.save();

            await ctx.reply(ctx.msg.info(`Berhasil mentransfer ${coinAmount} koin ke pengguna itu!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};