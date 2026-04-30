module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(tools.msg.info(`Bot telah aktif selama ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`));
    }
};