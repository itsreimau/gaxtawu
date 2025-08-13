const axios = require("axios");

module.exports = {
    name: "getgithubgist",
    aliases: ["getgist", "gist", "githubgist"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://gist.github.com/itsreimau/55792fc0386d183a581f8f723a6e4c73"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("neko", "/tools/getgist", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.content;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};