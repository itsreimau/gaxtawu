module.exports = {
    name: "ping",
    aliases: ["p"],
    category: "information",
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(tools.msg.info("Pong!"));
            const responseTime = performance.now() - startTime;
            await ctx.editMessage(ctx.id, pongMsg.key, tools.msg.info(`Pong! Merespon dalam ${tools.msg.convertMsToDuration(responseTime)}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};