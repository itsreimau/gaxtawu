module.exports = {
    name: "spotifysearch",
    aliases: ["spotify", "spotifys"],
    category: "search",
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

        if (!ctx.helper.isUrl(input))
            return await ctx.reply({
                text: ctx.msg.info("Input berupa URL, gunakan tombol download di bawah:"),
                buttons: [{
                    text: "Download",
                    id: `${ctx.used.prefix}spotifydl ${input}`
                }]
            });

        try {
            const apiUrl = ctx.api.createUrl("delirius", "/search/spotify", {
                q: input
            });
            const result = (await ctx.request.get(apiUrl)).data.data;

            const resultText = result.map(res =>
                `❖ ${ctx.msg.bold("Judul")}: ${res.title}\n` +
                `❖ ${ctx.msg.bold("Artis")}: ${res.artist}\n` +
                `❖ ${ctx.msg.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || ctx.msg.info(config.msg.notFound));
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};