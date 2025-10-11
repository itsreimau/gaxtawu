const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "sticker",
    aliases: ["s", "stiker"],
    category: "converter",
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, ["image", "gif", "video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["image", "gif", "video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["image", "gif", "video"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const sticker = await new Sticker(buffer)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(StickerTypes.FULL)
                .setCategories(["🌕"])
                .setId(ctx.msg.key.id)
                .setQuality(50)
                .build()

            await ctx.reply({
                sticker
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};