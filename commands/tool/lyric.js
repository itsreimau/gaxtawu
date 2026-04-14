const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        try {
            const apiUrl = tools.api.createUrl("chocomilk", "/v1/search/lyrics", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply(
                `— ${result.lyrics.join("\n")}\n` +
                "\n" +
                `➛ ${formatter.bold("Judul")}: ${result.title}\n` +
                `➛ ${formatter.bold("Artis")}: ${result.artist}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};