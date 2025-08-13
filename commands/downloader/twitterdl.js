const axios = require("axios");

module.exports = {
    name: "twitterdl",
    aliases: ["twitter", "twit", "twitdl", "x", "xdl"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://x.com/kaotaro12/status/1459493783964250118/video/1"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("davidcyril", "/twitterv2", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.find(d => d.quality.includes("720p"));

            return await ctx.reply({
                video: {
                    url: result.url
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};