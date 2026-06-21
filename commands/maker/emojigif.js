const WASF = require("wa-sticker-formatter");

module.exports = {
    name: "emojigif",
    aliases: ["egif"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [emoji] = Array.from(ctx.text?.matchAll(/\p{Emoji}/gu), (match) => match[0]).slice(0, 1);

        if (!emoji)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "😱")
            );

        try {
            const result = tools.api.createUrl("nexray", "/tools/emojigif", {
                emoji
            });
            const sticker = await new WASF.Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(WASF.StickerTypes.FULL)
                .setCategories(["🌕"])
                .setID(ctx.msg.key.id)
                .setQuality(50)
                .build();

            await ctx.reply({
                sticker
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};