module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target);
            targetDb.coin += coinAmount;
            targetDb.save();

            const flag = ctx.flag({
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent)
                await ctx.core.sendMessage(target, {
                    text: `ⓘ ${formatter.italic(`Anda telah menerima ${coinAmount} koin dari owner!`)}`
                });

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};