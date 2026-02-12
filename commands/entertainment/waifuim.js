const axios = require("axios");

module.exports = {
    name: "waifuim",
    aliases: ["wim"],
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifuim");
            return await ctx.reply(listText);
        }

        try {
            const listWaifuim = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
            const waifuim = listWaifuim.includes(input) ? input : tools.cmd.getRandomElement(listWaifuim);
            const apiUrl = tools.api.createUrl("https://api.waifu.im", "/search", {
                included_tags: waifuim
            });
            const result = (await axios.get(apiUrl)).data.images[0].url;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Kategori")}: ${tools.msg.ucwords(waifuim)}`,
                buttons: [{
                    buttonId: input ? `${ctx.used.prefix + ctx.used.command} ${input}` : ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};