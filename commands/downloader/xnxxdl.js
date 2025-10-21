const axios = require("axios");

module.exports = {
    name: "xnxxdl",
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "https://www.xnxx.com/video-187eejb8/ova_hentai_evangelion")
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("hang", "/download/xnxx", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.files;

            await ctx.reply({
                video: {
                    url: result.high || result.low
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};