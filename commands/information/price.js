module.exports = {
    name: "price",
    aliases: ["belibot", "harga", "sewa", "sewabot"],
    category: "information",
    code: async (ctx) => {
        try {
            const customText = await db.get("bot.text.price") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                formatter.quote("❎ Bot ini tidak memiliki harga.");

            return await ctx.reply({
                text: text,
                mentions: [ctx.sender.jid],
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};