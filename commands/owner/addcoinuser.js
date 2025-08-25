const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = ctx.quoted?.senderJid || ctx.getMentioned()[0] || (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted?.senderJid ? 0 : 1], 10) || null;

        if (!userJid || !coinAmount) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)} 8`))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [ctx.sender.jid]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(formatter.quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.add(`user.${ctx.getId(userJid)}.coin`, coinAmount);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.sendMessage(userJid, {
                text: formatter.quote(`📢 Kamu telah menerima ${coinAmount} koin dari Owner!`)
            });

            await ctx.reply(formatter.quote(`✅ Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};