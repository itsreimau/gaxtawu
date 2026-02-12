const axios = require("axios");

module.exports = {
    name: "wainsfwillustrious",
    aliases: ["nsfwgen", "wai"],
    category: "ai-generate",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair")
            );

        try {
            const apiUrl = tools.api.createUrl("danzy", "/api/ai/nsfwgen", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result.images[0];

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Prompt")}: ${input}`,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};