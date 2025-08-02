const axios = require("axios");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tiktoknowm", "tt", "ttdl", "vt", "vtdl", "vtdltiktok", "vtnowm"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@grazeuz/video/7486690677888158984"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("falcon", "/download/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.data;

            if (result.play && !result.images) return await ctx.reply({
                video: {
                    url: result.play
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
            if (result.images) {
                const album = result.images.map(imageUrl => ({
                    image: {
                        url: imageUrl
                    },
                    mimetype: tools.mime.lookup("jpeg")
                }));

                return await ctx.core.sendAlbumMessage(ctx.id, album, {
                    quoted: ctx.msg
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};