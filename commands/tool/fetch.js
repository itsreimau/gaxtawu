const axios = require("axios");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, config.bot.thumbnail))
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
                validateStatus: function(status) {
                    return true;
                }
            });

            const contentType = response?.headers?.["content-type"];

            if (/image/.test(contentType)) {
                await ctx.reply({
                    image: response?.data,
                    mimetype: tools.mime.contentType(contentType),
                    caption: formatter.quote("Untukmu, tuan!"),
                    footer: config.msg.footer
                });
            } else if (/video/.test(contentType)) {
                await ctx.reply({
                    video: response?.data,
                    mimetype: tools.mime.contentType(contentType),
                    caption: formatter.quote("Untukmu, tuan!"),
                    footer: config.msg.footer
                });
            } else if (/audio/.test(contentType)) {
                await ctx.reply({
                    audio: response?.data,
                    mimetype: tools.mime.contentType(contentType),
                    caption: formatter.quote("Untukmu, tuan!")
                });
            } else if (/webp/.test(contentType)) {
                const sticker = new Sticker(response?.data, {
                    pack: config.sticker.packname,
                    author: config.sticker.author,
                    type: StickerTypes.FULL,
                    categories: ["🌕"],
                    id: ctx.id,
                    quality: 50
                });

                await ctx.reply(await sticker.toMessage());
            } else if (!/utf-8|json|html|plain/.test(contentType)) {
                const fileName = /filename/i.test(response?.headers?.["content-disposition"]) ? response?.headers?.["content-disposition"]?.match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";

                await ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else {
                let text = response?.data;
                let json;

                try {
                    json = JSON.parse(text);
                } catch (error) {
                    json = null;
                }

                const responseText = json ? walkJSON(json) : text;
                await ctx.reply(responseText);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};

function walkJSON(json, depth = 0, array = []) {
    for (const key in json) {
        array.push(`${"┊".repeat(depth)}${depth > 0 ? " " : ""}${formatter.bold(key)}:`);
        if (typeof json[key] === "object" && json[key] !== null) {
            walkJSON(json[key], depth + 1, array);
        } else {
            array[array.length - 1] += ` ${json[key]}`;
        }
    }
    return array.join("\n");
}