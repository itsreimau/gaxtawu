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
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "https://www.instagram.com/p/DLzgi9pORzS")
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/instagram", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.url;
            const album = result.map(item => {
                const media = item.url[0];
                const isVideo = media.type === "mp4";

                return {
                    [isVideo ? "video" : "image"]: {
                        url: media.url
                    },
                    mimetype: tools.mime.lookup(media.ext)
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