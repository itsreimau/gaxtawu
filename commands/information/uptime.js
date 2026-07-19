module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(ctx.msg.info(`Bot telah aktif selama ${ctx.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`));
    }
};