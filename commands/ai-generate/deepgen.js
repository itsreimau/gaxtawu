module.exports = {
    name: "deepgen",
    category: "ai-generate",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair")
            );

        try {
            const result = tools.api.createUrl("neo", "/api/ai-image/deepai", {
                prompt: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`,
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