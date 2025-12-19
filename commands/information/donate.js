module.exports = {
    name: "donate",
    aliases: ["donasi", "support"],
    category: "information",
    code: async (ctx) => {
        try {
            const qrisLink = config?.text?.qris || null;
            const customText = config?.text?.donate || null;
            const text = customText ? customText.replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`).replace(/%name%/g, config.bot.name).replace(/%prefix%/g, ctx.used.prefix).replace(/%command%/g, ctx.used.command).replace(/%footer%/g, config.msg.footer).replace(/%readmore%/g, "\u200E".repeat(4001)) :
                "➛ 083838039693 (DANA & Pulsa & Kuota)\n" +
                "➛ https://paypal.me/itsreimau (PayPal)\n" +
                "➛ https://saweria.co/itsreimau (Saweria)\n" +
                "➛ https://tako.id/itsreimau (Tako)\n" +
                "➛ https://trakteer.id/itsreimau (Trakteer)";

            if (qrisLink) {
                await ctx.reply({
                    image: {
                        url: qrisLink
                    },
                    mimetype: tools.mime.lookup("png"),
                    caption: text,
                    mentions: [ctx.sender.jid]
                });
            } else {
                await ctx.reply({
                    text: text,
                    mentions: [ctx.sender.jid]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};