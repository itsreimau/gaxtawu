module.exports = {
    name: "kapankah",
    aliases: ["kapan"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion itu peak?"))
        );

        try {
            const minMs = 1000;
            const maxMs = 1000 * 60 * 60 * 24 * 365.25 * 10;
            const randomMs = Math.floor(Math.random() * (maxMs - minMs) + minMs);
            const duration = tools.msg.convertMsToDuration(randomMs);

            await ctx.reply(formatter.quote(`${duration} lagi...`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};