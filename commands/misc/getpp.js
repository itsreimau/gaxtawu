const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "getpp",
    aliases: ["geticon"],
    category: "misc",
    code: async (ctx) => {
        const targetJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET : null);

        if (!targetJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        try {
            const result = await ctx.core.profilePictureUrl(targetJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Akun")}: @${ctx.getId(targetJid)}`,
                mentions: [targetJid]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};