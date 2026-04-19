const axios = require("axios");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tt", "ttdl", "vt", "vtdl"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@netflixanime/video/7596931111805078805")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("chocomilk", "/v1/download/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.media;

            if (result.video) {
                await ctx.reply({
                    video: {
                        url: result.video
                    },
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                const album = result.images.map(res => ({
                    image: {
                        url: res
                    }
                }));

                await ctx.reply({
                    album,
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};