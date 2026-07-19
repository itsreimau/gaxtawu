module.exports = {
    name: "createqrcode",
    aliases: ["createqr"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            const result = ctx.api.createUrl("alwayscodex", "/api/tools/text2qr", {
                text: input
            });

            await ctx.reply({
                image: {
                    url: result
                }
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};