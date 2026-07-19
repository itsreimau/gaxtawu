module.exports = {
    name: "flux",
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                ctx.text.generateCmdExample(ctx.used, "anime girl with short blue hair")
            );

        try {
            const result = ctx.api.createUrl("alwayscodex", "/api/imageai/text2imgv2", {
                teks: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${ctx.text.bold("Prompt")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};