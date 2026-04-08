const axios = require("axios");

module.exports = {
    name: "youtubesummary",
    aliases: ["youtubesum", "ytsum", "ytsummary"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=v18fHSc813k")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("kuroneko", "/api/tools/ytsum", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.content;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};