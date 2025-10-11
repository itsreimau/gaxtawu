const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "getpp",
    aliases: ["geticon"],
    category: "misc",
    code: async (ctx) => {
        const userJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET : null);

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        try {
            const result = await ctx.core.profilePictureUrl(userJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpeg"),
                caption: formatter.quote(`Akun: @${ctx.getId(userJid)}`),
                mentions: [userJid],
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};