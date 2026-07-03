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
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
            );

        if (!tools.cmd.isUrl(url))
            return await ctx.reply({
                text: tools.msg.info("Input berupa URL, gunakan tombol download di bawah:"),
                buttons: [{
                    text: "Download",
                    id: `${ctx.used.prefix}spotifydl ${input}`
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/spotify", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Judul")}: ${res.title}\n` +
                `❖ ${formatter.bold("Artis")}: ${res.artist}\n` +
                `❖ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || tools.msg.info(config.msg.notFound));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};