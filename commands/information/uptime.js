module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(ctx.text.info(`Bot telah aktif selama ${ctx.text.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`));
    }
};