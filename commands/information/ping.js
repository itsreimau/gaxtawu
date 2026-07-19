module.exports = {
    name: "ping",
    aliases: ["p"],
    category: "information",
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(ctx.text.info("Pong!"));
            const responseTime = performance.now() - startTime;
            await ctx.editMessage(ctx.id, pongMsg.key, ctx.text.info(`Pong! Merespon dalam ${ctx.text.convertMsToDuration(responseTime)}.`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};