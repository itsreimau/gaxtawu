module.exports = {
    name: "price",
    aliases: ["belibot", "harga", "sewa", "sewabot"],
    category: "information",
    code: async (ctx) => {
        try {
            const customText = config?.text?.price || null;
            const text = customText ? customText.replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`).replace(/%name%/g, config.bot.name).replace(/%prefix%/g, ctx.used.prefix).replace(/%command%/g, ctx.used.command).replace(/%footer%/g, config.msg.footer).replace(/%readmore%/g, "\u200E".repeat(4001)) :
                `ⓘ ${formatter.italic("Bot ini tidak memiliki harga.")}`;

            await ctx.reply({
                text: text,
                mentions: [ctx.sender.jid]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};