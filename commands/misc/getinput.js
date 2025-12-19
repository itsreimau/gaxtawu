module.exports = {
    name: "getinput",
    category: "misc",
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            await ctx.reply(input);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};