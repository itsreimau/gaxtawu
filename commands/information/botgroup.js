module.exports = {
    name: "botgroup",
    aliases: ["botgc", "gcbot"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply({
            text: formatter.quote(config.bot.groupLink),
            linkPreview: true
        });
    }
};