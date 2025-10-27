const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const targetJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? (await ctx.core.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET))[0].lid : null);
        const coinAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!targetJid || !coinAmount) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                }),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        try {
            const targetDb = ctx.getDb("users", targetJid);
            targetDb.coin += coinAmount;
            targetDb.save();

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.core.sendMessage(targetJid, {
                text: `ⓘ ${formatter.italic(`Anda telah menerima ${coinAmount} koin dari Owner!`)}`
            });

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menambahkan ${coinAmount} koin kepada pengguna itu!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};