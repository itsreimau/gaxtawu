module.exports = {
    name: "konachan",
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
            const apiUrl = tools.api.createUrl("delirius", "/search/konachan", {
                q: input.replace(/\s/g, "_")
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data);

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