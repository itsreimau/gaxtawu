module.exports = {
    name: "xvideossearch",
    aliases: ["xvideos", "xvideoss"],
    category: "search",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "evangelion")
            );

        if (!tools.cmd.isUrl(url))
            return await ctx.reply({
                text: tools.msg.info("Input berupa URL, gunakan tombol download di bawah:"),
                buttons: [{
                    text: "Download",
                    id: `${ctx.used.prefix}xvideosdl ${input}`
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/xvideos", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Judul")}: ${res.title}\n` +
                `❖ ${formatter.bold("Channel")}: ${res.author}\n` +
                `❖ ${formatter.bold("Durasi")}: ${res.duration}\n` +
                `❖ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || tools.msg.info(config.msg.notFound));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};