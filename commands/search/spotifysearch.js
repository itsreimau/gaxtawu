const axios = require("axios");

module.exports = {
    name: "spotifysearch",
    aliases: ["spotify", "spotifys"],
    category: "search",
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

        const isUrl = tools.cmd.isUrl(input);
        if (isUrl)
            return await ctx.reply({
                text: tools.msg.info("Input berupa URL, gunakan tombol download di bawah:"),
                buttons: [{
                    text: "Download",
                    id: `${ctx.used.prefix}spotifydl ${input}`
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("nexray", "/search/spotify", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result.search_data;

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Judul")}: ${res.title}\n` +
                `➛ ${formatter.bold("Artis")}: ${res.artist}\n` +
                `➛ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || tools.msg.info(config.msg.notFound));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};