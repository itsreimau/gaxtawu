const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "delpremiumuser",
    aliases: ["delpremuser", "delprem", "dpu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? (await ctx.core.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET))[0].lid : null);

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

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
                text: formatter.quote("📢 Anda telah dihapus sebagai pengguna Premium oleh Owner!")
            });

            await ctx.reply(formatter.quote("✅ Berhasil menghapuskan Premium kepada pengguna itu!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};