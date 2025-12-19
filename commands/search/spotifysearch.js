const axios = require("axios");

module.exports = {
    name: "spotifysearch",
    aliases: ["spotify", "spotifys"],
    category: "search",
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

        const isUrl = tools.cmd.isUrl(input);
        if (isUrl)
            return await ctx.reply({
                text: `ⓘ ${formatter.italic("Input berupa URL, gunakan tombol download di bawah:")}`,
                buttons: [{
                    buttonId: `${ctx.used.prefix}spotifydl ${input}`,
                    buttonText: {
                        displayText: "Download"
                    }
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("znx", "/api/search/spotify", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.results.data;

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Judul")}: ${res.title}\n` +
                `➛ ${formatter.bold("Artis")}: ${res.artist}\n` +
                `➛ ${formatter.bold("URL")}: ${res.track_url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};