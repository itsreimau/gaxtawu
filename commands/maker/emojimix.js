const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "emojimix",
    aliases: ["emix"],
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join("");
        const emojis = Array.from(input.matchAll(/\p{Emoji}/gu), match => match[0]);
        const [emoji1, emoji2] = emojis.slice(0, 2);

        if (!emoji1 || !emoji2)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "😱 🤓")
            );

        try {
            const apiUrl = tools.api.createUrl("deline", "/maker/emojimix", {
                emoji1,
                emoji2
            });
            const result = (await axios.get(apiUrl)).data.result.png;
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};