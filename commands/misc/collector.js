const util = require("node:util");

module.exports = {
    name: "collector",
    aliases: ["collect"],
    category: "misc",
    code: async (ctx) => {
        const timeout = parseInt(ctx.args[0], 10) || 60000;
        if (isNaN(timeout)) return await ctx.reply(ctx.text.info("Waktu timeout harus berupa angka!"));

        try {
            const collector = ctx.MessageCollector({
                time: timeout,
                filter: (collCtx) => !collCtx.msg.key.fromMe
            });
            await ctx.reply(ctx.text.info(`Collector dimulai dengan timeout ${ctx.text.convertMsToDuration(timeout)}.`));

            collector.on("collect", async (collCtx) =>
                await collCtx.reply(ctx.text.monospace(util.inspect(collCtx.bot.m, {
                    depth: null,
                    maxArrayLength: null,
                    maxStringLength: null,
                    showHidden: true
                }))));

            collector.on("end", async () => await ctx.reply(ctx.text.info("Collector berhenti!")));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};