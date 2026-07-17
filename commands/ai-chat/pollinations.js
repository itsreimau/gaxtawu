module.exports = {
    name: "pollinations",
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
            const result = tools.api.createUrl("alwayscodex", "/api/imageai/pollinations", {
                prompt: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${tools.msg.bold("Prompt")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};