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
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const apiUrl = tools.api.createUrl("nexray", "/tools/telegram-sticker", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const userStickerwm = ctx.db.user?.stickerwm;
            const stickerPacks = await prepareStickerPack(result.sticker, result.title, `t.me/${result.name}`, ctx.msg.key.id, userStickerwm);

            for (const stickerPack of stickerPacks) {
                await ctx.reply({
                    cover: stickerPack.cover,
                    stickers: stickerPack.stickers,
                    name: stickerPack.name,
                    publisher: stickerPack.publisher,
                    description: stickerPack.description
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};

async function createSticker(stickerUrl, emoji, id, userStickerwm) {
    return await new Sticker(stickerUrl)
        .setPack(userStickerwm?.packname || config.sticker.packname)
        .setAuthor(userStickerwm?.author || config.sticker.author)
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

async function prepareStickerPack(stickers, title, publisher, packId, userStickerwm) {
    const maxPerPack = 30;
    const stickerChunks = chunkArray(stickers, maxPerPack);
    const packs = [];

    for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
        const chunk = stickerChunks[packIndex];

        const stickersPack = await Promise.all(chunk.map(async (sticker) => ({
            data: await createSticker(sticker.url, sticker.emoji, packId, userStickerwm),
            emojis: [sticker.emoji]
        })));

        packs.push({
            name: `${title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
            publisher: publisher,
            description: `Sticker Pack by ${config.bot.name}`,
            cover: await createSticker(stickers[0].url, stickers[0].emoji, packId, userStickerwm),
            stickers: stickersPack
        });
    }

    return packs;
}