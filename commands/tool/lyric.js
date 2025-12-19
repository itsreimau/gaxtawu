const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        try {
            const apiUrl = tools.api.createUrl("deline", "/tools/lyrics", {
                title: input
            });
            const result = (await axios.get(apiUrl)).data.result?.[0];

            await ctx.reply(
                `— ${result.plainLyrics}\n` +
                "\n" +
                `➛ ${formatter.bold("Judul")}: ${result.trackName}\n` +
                `➛ ${formatter.bold("Artis")}: ${result.albumName}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};