const axios = require("axios");

module.exports = {
    name: "youtubesearch",
    aliases: ["youtube", "youtubes", "yt", "yts", "ytsearch"],
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
                    buttonId: `${ctx.used.prefix}youtubeaudio ${input}`,
                    buttonText: {
                        displayText: "Download Audio"
                    }
                }, {
                    buttonId: `${ctx.used.prefix}youtubevideo ${input}`,
                    buttonText: {
                        displayText: "Download Video"
                    }
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("znx", "/api/search/youtube", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.results.filter(res => res.type === "video");

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Judul")}: ${res.title}\n` +
                `➛ ${formatter.bold("Channel")}: ${res.author.name}\n` +
                `➛ ${formatter.bold("Deskripsi")}: ${res.description}\n` +
                `➛ ${formatter.bold("Durasi")}: ${res.duration.timestamp}\n` +
                `➛ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};