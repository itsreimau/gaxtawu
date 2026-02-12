const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "gura",
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const profilePictureUrl = await ctx.core.profilePictureUrl(target, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const result = tools.api.createUrl("nekolabs", "/canvas/gura", {
                imageUrl: profilePictureUrl
            });
            const sticker = await new Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(StickerTypes.FULL)
                .setCategories(["🌕"])
                .setID(ctx.msg.key.id)
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