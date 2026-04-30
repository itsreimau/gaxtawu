const axios = require("axios");

module.exports = {
    name: "xvideosdl",
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.xvideos.com/video.ueppookde14/evangelion_hentai")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const apiUrl = tools.api.createUrl("deline", "/downloader/xvideos", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.videos;

            await ctx.reply({
                video: {
                    url: result.high || result.low
                },
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};