const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

const createSticker = async (stickerUrl, emoji, id) => {
    return await new Sticker(stickerUrl)
        .setPack(config.sticker.packname)
        .setAuthor(config.sticker.author)
        .setType(StickerTypes.FULL)
        .setCategories([emoji])
        .setID(id)
        .setQuality(50)
        .build();
};

module.exports = {
    name: "telegramstickerdl",
    aliases: ["telesticker", "telegramsticker"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://t.me/addstickers/ReiAyanamiEvangelionCute")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/telegram-sticker", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            const chunkSize = Math.ceil(result.stickers.length / Math.ceil(result.stickers.length / 30));
            const stickerChunks = [];

            for (let i = 0; i < result.stickers.length; i += chunkSize) {
                stickerChunks.push(result.stickers.slice(i, i + chunkSize));
            }

            for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
                const chunk = stickerChunks[packIndex];

                const stickersPack = await Promise.all(chunk.map(async (sticker, i) => ({
                    sticker: await createSticker(sticker.image_url, sticker.emoji, `${ctx.msg.key.id}_${packIndex}_${i}`),
                    emojis: [sticker.emoji],
                    accessibilityLabel: `Sticker ${i + 1}`,
                    isLottie: false,
                    isAnimated: sticker.image_url.endsWith(".webm")
                })));

                await ctx.reply({
                    stickerPack: {
                        name: `${result.title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
                        publisher: `t.me/${result.name}`,
                        description: `Pack by ${config.bot.name}`,
                        cover: await createSticker(result.stickers[0].image_url, result.stickers[0].emoji, ctx.msg.key.id),
                        stickers: stickersPack
                    }
                });

                if (packIndex < stickerChunks.length - 1) await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};