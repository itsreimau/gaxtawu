const axios = require("axios");

module.exports = {
    name: "gemini",
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")
            );

        try {
            const apiUrl = tools.api.createUrl("neo", "/api/ai/gemini", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.data.answer;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};