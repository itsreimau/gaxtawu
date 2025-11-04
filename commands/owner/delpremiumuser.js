const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "delpremiumuser",
    aliases: ["delpremuser", "delprem", "dpu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const targetJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? await ctx.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET) : null);

        if (!targetJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                }),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        try {
            const targetDb = ctx.getDb("users", targetJid);

            delete targetDb.premium;
            delete targetDb?.premiumExpiration;
            targetDb.save();

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.core.sendMessage(targetJid, {
                text: `ⓘ ${formatter.italic("Anda telah dihapus sebagai pengguna premium oleh owner!")}`
            });

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil menghapuskan premium kepada pengguna itu!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};