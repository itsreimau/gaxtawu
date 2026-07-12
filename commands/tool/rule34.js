module.exports = {
    name: "rule34",
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            const apiUrl = tools.api.createUrl("delirius", "/search/rule34", {
                query: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.images);

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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};