module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(`ⓘ ${formatter.italic(`Bot telah aktif selama ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`)}`);
    }
};