const { Baileys } = require("@itsreimau/gktw");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "gura",
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const userJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET : null);

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        try {
            const profilePictureUrl = await ctx.core.profilePictureUrl(userJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const result = tools.api.createUrl("nekolabs", "/canvas/gura", {
                imageUrl: profilePictureUrl
            });
            const sticker = await new Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(StickerTypes.FULL)
                .setCategories(["🌕"])
                .setId(ctx.msg.key.id)
                .setQuality(50)
                .build();

            await ctx.reply({
                sticker
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};