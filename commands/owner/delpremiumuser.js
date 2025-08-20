module.exports = {
    name: "delpremiumuser",
    aliases: ["delpremuser", "delprem", "dpu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = ctx?.quoted.senderJid || ctx.getMentioned()[0] || (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@s.whatsapp.net` : null);

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [ctx.sender.jid]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(formatter.quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            const userId = ctx.getId(userJid);

            await db.delete(`user.${userId}.premium`);
            await db.delete(`user.${userId}.premiumExpiration`);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.sendMessage(userJid, {
                text: formatter.quote("📢 Kamu telah dihapus sebagai pengguna Premium oleh Owner!")
            });

            return await ctx.reply(formatter.quote("✅ Berhasil menghapuskan Premium kepada pengguna itu!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};