// Saya tidak tahu mengapa stiker-stiker tersebut tidak bisa diunduh
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const axios = require("axios");

module.exports = {
    name: "telegramstickerdl",
    aliases: ["telesticker", "telegramsticker"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://t.me/addstickers/ReiAyanamiEvangelionCute")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izukumii", "/downloader/telegram-sticker", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const stickerPacks = await prepareStickerPack(result.stickers, result.title, `t.me/${result.name}`, ctx.msg.key.id);

            for (const pack of stickerPacks) {
                await ctx.reply({
                    stickerPack: pack
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};

async function createSticker(stickerUrl, emoji, id) {
    return await new Sticker(stickerUrl)
        .setPack(config.sticker.packname)
        .setAuthor(config.sticker.author)
        .setType(StickerTypes.FULL)
        .setCategories([emoji])
        .setID(id)
        .setQuality(50)
        .build();
}

async function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function prepareStickerPack(stickers, title, publisher, packId, maxPerPack = 30) {
    const stickerChunks = chunkArray(stickers, maxPerPack);
    const packs = [];

    for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
        const chunk = stickerChunks[packIndex];

        const stickersPack = await Promise.all(
            chunk.map(async (sticker, i) => ({
                sticker: await createSticker(
                    sticker.image_url,
                    sticker.emoji,
                    `${packId}_${packIndex}_${i}`
                ),
                emojis: [sticker.emoji],
                accessibilityLabel: `Sticker ${i + 1}`,
                isLottie: false,
                isAnimated: sticker.image_url.endsWith(".webm")
            }))
        );

        packs.push({
            name: `${title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
            publisher: publisher,
            description: `Sticker Pack by ${config.bot.name}`,
            cover: await createSticker(stickers[0].image_url, stickers[0].emoji, packId),
            stickers: stickersPack
        });
    }

    return packs;
};