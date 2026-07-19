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
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                ctx.text.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            const apiUrl = ctx.api.createUrl("alwayscodex", "/api/search/pinterest", {
                query: input,
                limit: 250
            });
            const result = ctx.helper.getRandomElement((await ctx.request.get(apiUrl)).data.result.items).image;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${ctx.text.bold("Kueri")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};