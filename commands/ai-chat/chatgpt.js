const axios = require("axios");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "gpt"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")
            );

        try {
            const apiUrl = tools.api.createUrl("lexcode", "/api/ai/gpt5-nano", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result.result;

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