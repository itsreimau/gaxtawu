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
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        try {
            const apiUrl = ctx.api.createUrl("delirius", "/search/lyrics", {
                query: input
            });
            const result = (await ctx.request.get(apiUrl)).data.data;

            await ctx.reply(
                `✦ — ${result.lyrics}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Judul")}: ${result.title}\n` +
                `❖ ${ctx.msg.bold("Artis")}: ${result.artists}`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};