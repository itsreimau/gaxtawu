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
                tools.msg.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
                validateStatus: () => true
            });
            const contentType = response?.headers?.["content-type"] || "";
            const data = response?.data;

            if (/webp/.test(contentType)) {
                const sticker = await new Sticker(data)
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
            } else if (/image/.test(contentType)) {
                await ctx.reply({
                    image: data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (/video/.test(contentType)) {
                await ctx.reply({
                    video: data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (/audio/.test(contentType)) {
                await ctx.reply({
                    audio: data,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else if (!/text|json|html|plain|utf-8/i.test(contentType)) {
                let fileName = "";
                const contentDisposition = response?.headers?.["content-disposition"];
                if (contentDisposition && /filename/i.test(contentDisposition)) {
                    const match = contentDisposition.match(/filename[=*]?["']?(.*?)["']?[;]?$/i);
                    fileName = match?.[1]?.replace(/["';]/g, "") || "";
                }

                await ctx.reply({
                    document: data,
                    fileName,
                    mimetype: tools.mime.contentType(contentType)
                });
            } else {
                let text = data.toString();
                let json = null;

                try {
                    json = JSON.parse(text);
                } catch {}

                await ctx.reply({
                    code: json ? walkJSON(json) : text,
                    language: json ? "json" : "html"
                });
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