module.exports = [{
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const daysAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.msg.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${ctx.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ])}\n` +
                    ctx.msg.generatesFlagInfo({
                        "-s": "Tetap diam dengan tidak menyiarkan ke akun target"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(ctx.msg.info("Durasi premium (dalam hari) harus diisi dan lebih dari 0!"));

        try {
            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;

            const targetDb = ctx.getDb("users", target.jid);
            targetDb.premium = true;
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                targetDb.premiumExpiration = expirationDate;
                targetDb.save();

                if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.msg.info(`Anda telah ditambahkan sebagai pengguna premium oleh owner selama ${daysAmount} hari!`));

                await ctx.reply(ctx.msg.info(`Berhasil menambahkan premium selama ${daysAmount} hari kepada pengguna itu!`));
            } else {
                targetDb.premiumExpiration == null;
                targetDb.save();

                if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.msg.info("Anda telah ditambahkan sebagai pengguna premium selamanya oleh owner!"));

                await ctx.reply(ctx.msg.info("Berhasil menambahkan premium selamanya kepada pengguna itu!"));
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "delpremiumuser",
    aliases: ["delpremuser", "delprem", "dpu"],
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
            targetDb.premium = false;
            targetDb.premiumExpiration = null;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, ctx.msg.info("Anda telah dihapus sebagai pengguna premium oleh owner!"));

            await ctx.reply(ctx.msg.info("Berhasil menghapuskan premium kepada pengguna itu!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];