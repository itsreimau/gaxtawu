module.exports = {
    name: "namapurba",
    aliases: ["purba"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "itsreimau")
        );

        try {
            const result = input.replace(/[aiueo]/gi, "$&ve");

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};