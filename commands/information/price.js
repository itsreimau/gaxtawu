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
                product: {
                    productImage: {
                        url: config.bot.thumbnail
                    },
                    productImageCount: 1,
                    title: config.bot.name,
                    description: config.bot.version,
                    priceAmount1000: 20000 * 1000,
                    currencyCode: "IDR",
                    retailerId: ctx.id,
                    url: config.bot.groupLink
                },
                businessOwnerJid: config.owner.id,
                caption: text,
                footer: config.msg.footer,
                interactiveButtons: [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Grup Bot",
                        url: config.bot.groupLink
                    })
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};