const axios = require("axios");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.instagram.com/p/DLzgi9pORzS")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("yp", "/api/downloader/Instagram", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.medias;
            const album = result.map(res => {
                return {
                    [res.type]: {
                        url: res.url
                    },
                    mimetype: tools.mime.lookup(res.type === "video" ? "mp4" : "png")
                };
            });

            await ctx.reply({
                album,
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};