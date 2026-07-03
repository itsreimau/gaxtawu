module.exports = {
    name: "xnxxsearch",
    aliases: ["xnxx", "xnxxs"],
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
                    id: `${ctx.used.prefix}xnxxdl ${input}`
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/xnxxsearch", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Judul")}: ${res.title}\n` +
                `❖ ${formatter.bold("Durasi")}: ${res.duration}\n` +
                `❖ ${formatter.bold("URL")}: ${res.link}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || tools.msg.info(config.msg.notFound));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};