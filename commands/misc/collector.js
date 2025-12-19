const util = require("node:util");

module.exports = {
    name: "collector",
    aliases: ["collect"],
    category: "misc",
    code: async (ctx) => {
        const timeout = parseInt(ctx.args[0]) || 60000;
        if (isNaN(timeout)) return await ctx.reply(`ⓘ ${formatter.italic("Waktu timeout harus berupa angka!")}`);

        try {
            const collector = ctx.MessageCollector({
                time: timeout,
                filter: collCtx => !collCtx.msg.key.fromMe
            });
            await ctx.reply(`ⓘ ${formatter.italic(`Collector dimulai dengan timeout ${tools.msg.convertMsToDuration(timeout)}.`)}`);

            collector.on("collect", async (collCtx) => await collCtx.reply(util.format(collCtx.bot.m)));

            collector.on("end", async () => await ctx.reply(`ⓘ ${formatter.italic("Collector berhenti!")}`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};