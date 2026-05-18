module.exports = {
    name: "perplexity",
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
            const apiUrl = tools.api.createUrl("nekolabs", "/text.gen/perplexity", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result.response;

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