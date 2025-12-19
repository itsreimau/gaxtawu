module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        const senderDb = ctx.db.user;

        if (ctx.sender.isOwner() || senderDb?.premium) return await ctx.reply(`ⓘ ${formatter.italic("Koin tak terbatas tidak dapat ditransfer.")}`);
        if (coinAmount <= 0) return await ctx.reply(`ⓘ ${formatter.italic("Jumlah koin tidak boleh kurang dari atau sama dengan 0!")}`);
        if (senderDb?.coin < coinAmount) return await ctx.reply(`ⓘ ${formatter.italic("Koin Anda tidak mencukupi untuk transfer ini!")}`);

        try {
            const targetDb = ctx.getDb("users", target);
            targetDb.coin += coinAmount;
            senderDb.coin -= coinAmount;
            targetDb.save();
            senderDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil mentransfer ${coinAmount} koin ke pengguna itu!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};