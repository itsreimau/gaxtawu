module.exports = {
    name: "bluearchivelogo",
    aliases: ["balogo"],
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "evang|elion")
            );

        try {
            const [left, right = " "] = input.split("|");
            const result = tools.api.createUrl("nekolabs", "/canvas/ba-logo", {
                textL: left,
                textR: right
            });

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};