const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "unbanuser",
    aliases: ["ubu", "unban"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = await ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? (await ctx.core.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET))[0].lid : null);

        if (!userJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                }),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        try {
            const userDb = ctx.getDb("users", userJid);
            userDb.banned = false;
            userDb.save();

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent) await ctx.sendMessage(userJid, {
                text: `ⓘ ${formatter.italic("Anda telah diunbanned oleh Owner!")}`
            });

            await ctx.reply(` ⓘ ${formatter.italic("Berhasil diunbanned!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};