module.exports = {
    name: "youtubesearch",
    aliases: ["youtube", "youtubes", "yt", "yts", "ytsearch"],
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
                    text: "Download Audio",
                    id: `${ctx.used.prefix}youtubeaudio ${input}`
                }, {
                    text: "Download Video",
                    id: `${ctx.used.prefix}youtubevideo ${input}`
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/ytsearch", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Judul")}: ${res.title}\n` +
                `❖ ${formatter.bold("Channel")}: ${res.author.name}\n` +
                `❖ ${formatter.bold("Durasi")}: ${res.duration}\n` +
                `❖ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || tools.msg.info(config.msg.notFound));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};