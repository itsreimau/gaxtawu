const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "stickerwm",
    aliases: ["swm", "stikerwm"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["text", "sticker"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "does this impact the lore?|@rei-ayanami"))
        );

        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["sticker"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["sticker"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const [packname, author] = input.split("|");
            const sticker = await new Sticker(buffer)
                .setPack(packname || "")
                .setAuthor(author || "")
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