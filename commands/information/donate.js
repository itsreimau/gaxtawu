module.exports = {
    name: "donate",
    aliases: ["donasi", "support"],
    category: "information",
    code: async (ctx) => {
        try {
            const botDb = ctx.db.bot || {};
            const qrisLink = botDb?.text?.qris || null;
            const customText = botDb?.text?.donate || null;
            const text = customText ?
                customText.replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`).replace(/%name%/g, config.bot.name).replace(/%prefix%/g, ctx.used.prefix).replace(/%command%/g, ctx.used.command).replace(/%footer%/g, config.msg.footer).replace(/%readmore%/g, config.msg.readmore) :
                "➛ 083838039693 (DANA & Pulsa & Kuota)\n" +
                "➛ https://paypal.me/itsreimau (PayPal)\n" +
                "➛ https://saweria.co/itsreimau (Saweria)\n" +
                "➛ https://tako.id/itsreimau (Tako)\n" +
                "➛ https://trakteer.id/itsreimau (Trakteer)"

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