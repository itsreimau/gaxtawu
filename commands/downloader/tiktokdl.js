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
                tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@clero0_zi/video/7595185035498622216")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("nexray", "/downloader/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.data;

            if (!Array.isArray(result)) {
                await ctx.reply({
                    video: {
                        url: result
                    },
                    mimetype: tools.mime.lookup("mp4"),
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                const album = result.data.map(res => ({
                    image: {
                        url: res
                    },
                    mimetype: tools.mime.lookup("png")
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