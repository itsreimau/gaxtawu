module.exports = {
    name: "bluearchivelogo",
    aliases: ["balogo"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "evang|elion")
        );

        try {
            const [left, right] = input.split("|");
            const result = tools.api.createUrl("nekolabs", "/maker/ba-logo", {
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