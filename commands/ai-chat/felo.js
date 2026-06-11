module.exports = {
    name: "felo",
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
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/ai/felo", {
                teks: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};