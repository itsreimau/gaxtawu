const axios = require("axios");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.instagram.com/p/DLzgi9pORzS"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("zell", "/download/instagram", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.url;
            const medias = result.flatMap(item =>
                item.map(media => ({
                    type: media.type === "mp4" ? "video" : "image",
                    url: media.url,
                    mimetype: tools.mime.lookup(media.ext)
                }))
            );
            const album = medias.map(media => {
                const isVideo = media.type === "video";
                return {
                    [isVideo ? "video" : "image"]: {
                        url: media.url
                    },
                    mimetype: media.mimetype
                };
            });

            return await ctx.reply({
                album,
                caption: formatter.quote(`URL: ${url}`)
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};