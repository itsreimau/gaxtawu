const axios = require("axios");

module.exports = {
    name: "animagine",
    category: "ai-generate",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair")
            );

        try {
            const apiUrl = tools.api.createUrl("vreden", "/api/v1/artificial/animagine", {
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.result.image.results;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `➛ ${formatter.bold("Prompt")}: ${input}`,
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