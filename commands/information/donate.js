module.exports = {
    name: "donate",
    aliases: ["donasi", "support"],
    category: "information",
    code: async (ctx) => {
        try {
            const qrisLink = await db.get("bot.text.qris") || null;
            const customText = await db.get("bot.text.donate") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                `${formatter.quote("083838039693 (DANA)")}\n` +
                `${formatter.quote("083838039693 (Pulsa & Kuota)")}\n` +
                `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                `${formatter.quote("https://paypal.me/itsreimau (PayPal)")}\n` +
                `${formatter.quote("https://saweria.co/itsreimau (Saweria)")}\n` +
                `${formatter.quote("https://tako.id/itsreimau (Tako)")}\n` +
                formatter.quote("https://trakteer.id/itsreimau (Trakteer)");

            if (qrisLink) {
                await ctx.reply({
                    image: {
                        url: qrisLink
                    },
                    mimetype: tools.mime.lookup("jpg"),
                    caption: text,
                    mentions: [ctx.sender.jid],
                    footer: config.msg.footer
                });
            } else {
                await ctx.reply({
                    text: text,
                    mentions: [ctx.sender.jid],
                    footer: config.msg.footer
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};