module.exports = {
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
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
                    `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Tetap diam dengan tidak menyiarkan ke akun target"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target.jid);
            delete targetDb.premium;
            delete targetDb?.premiumExpiration;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent || !config.system.restrict) await ctx.sendMessage(target.jid, `ⓘ ${formatter.italic("Anda telah dihapus sebagai pengguna premium oleh owner!")}`);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil menghapuskan premium kepada pengguna itu!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};