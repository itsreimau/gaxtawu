module.exports = [{
    name: "banuser",
    aliases: ["ban", "bu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.text.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
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
            targetDb.banned = true;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.text.info("Anda telah dibanned oleh owner!"));

            await ctx.reply(ctx.text.info("Berhasil dibanned!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "unbanuser",
    aliases: ["ubu", "unban"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.text.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
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
            targetDb.banned = false;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.text.info("Anda telah diunbanned oleh owner!"));

            await ctx.reply(ctx.text.info("Berhasil diunbanned!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];