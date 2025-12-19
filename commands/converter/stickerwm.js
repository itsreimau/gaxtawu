const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "stickerwm",
    aliases: ["take", "swm", "stikerwm"],
    category: "converter",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send", "reply"], ["text", "sticker"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "does this impact the lore?|@rei-ayanami")
            );

        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["sticker"])) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["sticker"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const [packname, author] = input.split("|");
            const sticker = await new Sticker(buffer)
                .setPack(packname || "")
                .setAuthor(author || "")
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