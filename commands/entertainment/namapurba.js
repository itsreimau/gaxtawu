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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))
        );

        try {
            const result = input.replace(/[aiueo]/gi, "$&ve");

            await ctx.reply(formatter.quote(result));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};