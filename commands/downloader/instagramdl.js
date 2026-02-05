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
            const apiUrl = tools.api.createUrl("deline", "/downloader/ig", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.media;
            const album = [];
            result.images.forEach(image => {
                album.push({
                    image: {
                        url: image
                    },
                    mimetype: tools.mime.lookup("png")
                });
            });
            result.videos.forEach(video => {
                album.push({
                    video: {
                        url: video
                    },
                    mimetype: tools.mime.lookup("mp4")
                });
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