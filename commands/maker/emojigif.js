const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "emojigif",
    aliases: ["egif"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join("");
        const emojis = Array.from(input.matchAll(/\p{Emoji}/gu), (match) => match[0]);
        const [emoji] = emojis.slice(0, 1);

        if (!emoji) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "😱"))
        );

        try {
            const result = tools.api.createUrl("hang", "/tools/emojitogif", {
                emoji
            });
            const sticker = new Sticker(result, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            await ctx.reply(await sticker.toMessage());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};