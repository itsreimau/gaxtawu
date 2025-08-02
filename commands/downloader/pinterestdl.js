const axios = require("axios");

module.exports = {
    name: "pinterestdl",
    aliases: ["pindl", "pintdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://id.pinterest.com/pin/313422455339425808"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/download/pinterest", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const album = result.map(media => {
                const isVideo = media.format === "MP4";
                return {
                    [isVideo ? "video" : "image"]: {
                        url: media.url
                    },
                    mimetype: tools.mime.lookup(isVideo ? "mp4" : "jpg")
                };
            });

            return await ctx.core.sendAlbumMessage(ctx.id, album, {
                quoted: ctx.msg
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};