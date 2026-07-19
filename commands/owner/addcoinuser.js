module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.text.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${ctx.text.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                     ])}\n` +
                    ctx.text.generatesFlagInfo({
                        "-s": "Tetap diam dengan tidak menyiarkan ke akun target"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.coin += coinAmount;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.text.info(`Anda telah menerima ${coinAmount} koin dari owner!`));

            await ctx.reply(ctx.text.info(`Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};