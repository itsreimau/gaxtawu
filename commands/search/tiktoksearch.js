module.exports = {
    name: "tiktoksearch",
    aliases: ["tiktoks", "ttsearch"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "evangelion")
            );

        try {
            const apiUrl = ctx.api.createUrl("delirius", "/search/tiktoksearch", {
                query: input
            });
            const result = ctx.helper.getRandomElement((await ctx.request.get(apiUrl)).data.meta).hd;

            await ctx.reply({
                video: {
                    url: result
                },
                caption: `❖ ${ctx.msg.bold("Kueri")}: ${input}`,
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