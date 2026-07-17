module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/lyrics", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply(
                `✦ — ${result.lyrics}\n` +
                "\n" +
                `❖ ${tools.msg.bold("Judul")}: ${result.title}\n` +
                `❖ ${tools.msg.bold("Artis")}: ${result.artists}`
            );
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};