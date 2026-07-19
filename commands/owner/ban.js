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
                text: `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.msg.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
                    `${ctx.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ])}\n` +
                    ctx.msg.generatesFlagInfo({
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
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.msg.info("Anda telah dibanned oleh owner!"));

            await ctx.reply(ctx.msg.info("Berhasil dibanned!"));
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
                text: `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.msg.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
                    `${ctx.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ])}\n` +
                    ctx.msg.generatesFlagInfo({
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
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.msg.info("Anda telah diunbanned oleh owner!"));

            await ctx.reply(ctx.msg.info("Berhasil diunbanned!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];