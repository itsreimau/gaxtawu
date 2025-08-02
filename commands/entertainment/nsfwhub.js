module.exports = {
    name: "nsfwhub",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("nsfwhub");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const listNsfwhub = ["anal", "ass", "bdsm", "black", "blowjub", "boobs", "bottomless", "collared", "cum", "cumsluts", "dick", "dom", "dp", "easter", "extreme", "feet", "finger", "fuck", "futa", "gay", "group", "hentai", "kiss", "lesbian", "lick", "pegged", "puffies", "pussy", "real", "sixtynine", "suck", "tattoo", "tiny", "xmas"];
            const nsfwhub = listNsfwhub.includes(input) ? input : tools.cmd.getRandomElement(listNsfwhub);
            const result = tools.api.createUrl("nekorinn", `/nsfwhub/${nsfwhub}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Kategori: ${tools.msg.ucwords(nsfwhub)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: input ? `${ctx.used.prefix + ctx.used.command} ${input}` : ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};