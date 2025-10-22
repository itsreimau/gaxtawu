module.exports = {
    name: "ping",
    aliases: ["p"],
    category: "information",
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(`ⓘ ${formatter.italic("Pong!")}`);
            const responseTime = performance.now() - startTime;
            await ctx.editMessage(pongMsg.key, `ⓘ ${formatter.italic(`Pong! Merespon dalam ${tools.msg.convertMsToDuration(responseTime)}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};