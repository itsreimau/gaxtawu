const axios = require("axios");

module.exports = {
    name: "grok",
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        try {
            const apiUrl = tools.api.createUrl("nekolabs", "/text-generation/grok/4", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result.text;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};