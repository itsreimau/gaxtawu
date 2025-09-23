const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "banuser",
    aliases: ["ban", "bu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = await ctx.quoted?.senderLid() || await Baileys.getLIDForPN(ctx.getMentioned()[0]) || (ctx.args[0] ? await Baileys.getLIDForPN(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET) : null);

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        try {
            await db.set(`user.${ctx.getId(userJid)}.banned`, true);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.sendMessage(userJid, {
                text: formatter.quote("📢 Anda telah dibanned oleh Owner!")
            });

            await ctx.reply(formatter.quote("✅ Berhasil dibanned!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};