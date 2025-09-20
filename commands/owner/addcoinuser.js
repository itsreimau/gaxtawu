const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || (ctx.args[0] ? await ctx.convertJid(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET, "lid") : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!userJid || !coinAmount) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@0 8`))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

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
                text: formatter.quote(`📢 Anda telah menerima ${coinAmount} koin dari Owner!`)
            });

            await ctx.reply(formatter.quote(`✅ Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};