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
            const apiUrl = tools.api.createUrl("zenzxz", "/downloader/aio", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.medias;
            const medias = result.filter(media => media.type === "image" || media.type === "video");
            const album = medias.map(media => {
                const isVideo = media.type === "video";
                return {
                    [isVideo ? "video" : "image"]: {
                        url: media.url
                    },
                    mimetype: tools.mime.lookup(isVideo ? "mp4" : "jpg")
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