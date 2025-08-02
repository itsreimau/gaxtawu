const axios = require("axios");

module.exports = {
    name: "waifuim",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifuim");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const listWaifuim = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
            const waifuim = listWaifuim.includes(input) ? input : tools.cmd.getRandomElement(listWaifuim);
            const apiUrl = tools.api.createUrl("https://api.waifu.im", "/search", {
                included_tags: waifuim
            });
            const result = (await axios.get(apiUrl)).data.images[0].url;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Kategori: ${tools.msg.ucwords(waifuim)}`),
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