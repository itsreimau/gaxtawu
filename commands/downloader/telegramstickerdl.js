const WASF = require("wa-sticker-formatter");

module.exports = {
    name: "telegramstickerdl",
    aliases: ["telesticker", "telegramsticker"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://t.me/addstickers/ReiAyanamiEvangelionCute")
            );

        if (!tools.helper.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("delirius", "/download/telegramsticker", {
                url
            });
            const result = (await axios.get(apiUrl)).data;
            const stickerPacks = await prepareStickerPack(result.stickers, result.title, ctx.msg.key.id);

            for (const stickerPack of stickerPacks) {
                await ctx.reply(stickerPack);
            }
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};

async function createSticker(stickerUrl, id) {
    return await new WASF.Sticker(stickerUrl)
        .setPack(config.sticker.packname)
        .setAuthor(config.sticker.author)
        .setType(WASF.StickerTypes.FULL)
        .setCategories(["🌕"])
        .setID(id)
        .setQuality(50)
        .build();
}

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function prepareStickerPack(stickers, title, packId) {
    const maxPerPack = 30;
    const stickerChunks = chunkArray(stickers, maxPerPack);
    const packs = [];

    for (let packIndex = 0; packIndex < stickerChunks.length; packIndex++) {
        const chunk = stickerChunks[packIndex];

        const stickersPack = await Promise.all(chunk.map(async (sticker) => ({
            data: await createSticker(sticker.url, packId),
            emojis: ["🌕"]
        })));

        packs.push({
            name: `${title}${stickerChunks.length > 1 ? ` (${packIndex + 1}/${stickerChunks.length})` : ""}`,
            description: `Packed by ${config.bot.name}`,
            cover: await createSticker(stickers[0].url, packId),
            stickers: stickersPack
        });
    }

    return packs;
}