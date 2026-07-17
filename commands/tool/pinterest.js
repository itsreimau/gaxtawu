module.exports = {
    name: "pinterest",
    aliases: ["pin"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/search/pinterest", {
                query: input,
                limit: 250
            });
            const result = tools.helper.getRandomElement((await axios.get(apiUrl)).data.result.items).image;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Kueri")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};