const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "fetch",
    aliases: ["f", "get"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, config.bot.thumbnail)
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
                validateStatus: (() => true)
            });
            const contentType = response?.headers?.["content-type"];

            if (/image/.test(contentType)) {
                await ctx.reply({
                    image: response?.data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (/video/.test(contentType)) {
                await ctx.reply({
                    video: response?.data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (/audio/.test(contentType)) {
                await ctx.reply({
                    audio: response?.data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (/webp/.test(contentType)) {
                const sticker = await new Sticker(response?.data)
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
            } else if (!/utf-8|json|html|plain/.test(contentType)) {
                const fileName = /filename/i.test(response?.headers?.["content-disposition"]) ? response?.headers?.["content-disposition"]?.match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";

                await ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else {
                const text = response?.data;
                let json = null;
                try {
                    json = JSON.parse(text);
                } catch {}

                await ctx.reply(json ? walkJSON(json) : text);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};

function walkJSON(json, depth = 0, array = []) {
    for (const key in json) {
        array.push(`${"┊".repeat(depth)}${depth > 0 ? " " : ""}${formatter.bold(key)}:`);
        if (typeof json[key] === "object" && json[key] !== undefined) {
            walkJSON(json[key], depth + 1, array);
        } else {
            array[array.length - 1] += ` ${json[key]}`;
        }
    }
    return array.join("\n");
}