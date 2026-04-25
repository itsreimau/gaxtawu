// Saya tidak tahu mengapa stiker-stiker tersebut tidak bisa diunduh
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const axios = require("axios");

module.exports = {
    name: "stickerlydl",
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://sticker.ly/s/SXYF2W")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl)
            return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("cuki", "/api/sticker/stickerly-detail", {
                url
            }, "apikey");
            const result = (await axios.get(apiUrl)).data.data;
            const stickerPacks = await prepareStickerPack(result.stickers, result.name, `t.me/${result.name}`, ctx.msg.key.id);

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

async function createSticker(stickerUrl, id) {
    return await new Sticker(stickerUrl)
        .setPack(config.sticker.packname)
        .setAuthor(config.sticker.author)
        .setType(StickerTypes.FULL)
        .setCategories(["🌕"])
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

async function prepareStickerPack(stickers, title, publisher, packId) {
    const maxPerPack = 30;
    const stickerChunks = chunkArray(stickers, maxPerPack);
    const packs = [];

    for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
        const chunk = stickerChunks[packIndex];

        const stickersPack = await Promise.all(chunk.map(async (sticker) => ({
            data: await createSticker(sticker.imageUrl, packId),
            emojis: ["🌕"]
        })));

        packs.push({
            name: `${title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
            publisher: publisher,
            description: `Sticker Pack by ${config.bot.name}`,
            cover: await createSticker(stickers[0].url, packId),
            stickers: stickersPack
        });
    }

    return packs;
}