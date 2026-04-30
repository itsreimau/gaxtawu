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
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                    tools.msg.generatesFlagInfo({
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
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, tools.msg.info(`Anda telah menerima ${coinAmount} koin dari owner!`));

            await ctx.reply(tools.msg.info(`Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};