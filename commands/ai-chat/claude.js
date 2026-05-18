module.exports = {
    name: "claude",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")
            );

        try {
            const apiUrl = tools.api.createUrl("lexcode", "/api/ai/claude-3-haiku", {
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                richResponse: [{
                    text: result
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};