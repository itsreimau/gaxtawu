const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "telegramstickerdl",
    aliases: ["telesticker", "telegramsticker"],
    category: "downloader",
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://t.me/addstickers/ReiAyanamiEvangelionCute"))
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/telegram-sticker", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            const stickerChunks = [];
            for (let i = 0; i < result.stickers.length; i += 30) {
                stickerChunks.push(result.stickers.slice(i, i + 30));
            }

            for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
                const chunk = stickerChunks[packIndex];
                const stickersPack = [];

                for (let i = 0; i < chunk.length; i++) {
                    const sticker = chunk[i];
                    const stickerBuffer = await new Sticker(sticker.image_url)
                        .setPack(config.sticker.packname)
                        .setAuthor(config.sticker.author)
                        .setType(StickerTypes.FULL)
                        .setCategories([sticker.emoji])
                        .setID(`${ctx.msg.key.id}_${packIndex}_${i}`)
                        .setQuality(50)
                        .build();
                    stickersPack.push({
                        sticker: stickerBuffer,
                        emojis: [sticker.emoji],
                        accessibilityLabel: `Sticker ${i + 1}`,
                        isLottie: false,
                        isAnimated: sticker.image_url.endsWith(".webm")
                    });
                }

                await ctx.reply({
                    stickerPack: {
                        name: `${result.title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
                        publisher: `t.me/${result.name}`,
                        description: `Pack by ${config.bot.name}`,
                        cover: await new Sticker(result.stickers[0].image_url)
                            .setPack(config.sticker.packname)
                            .setAuthor(config.sticker.author)
                            .setType(StickerTypes.FULL)
                            .setCategories([result.stickers[0].emoji])
                            .setID(ctx.msg.key.id)
                            .setQuality(50)
                            .build(),
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