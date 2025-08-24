const axios = require("axios");

module.exports = {
    name: "waifupicsnsfw",
    aliases: ["wpicsnsfw"],
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifupicsnsfw");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const listWaifupics = ["waifu", "neko", "trap"];
            const waifupics = listWaifupics.includes(input) ? input : tools.cmd.getRandomElement(listWaifupics);
            const apiUrl = tools.api.createUrl("https://api.waifu.pics", `/nsfw/${waifupics}`);
            const result = (await axios.get(apiUrl)).data.url;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: `${formatter.quote(`Kategori: ${tools.msg.ucwords(waifupics)}`)}\n` +
                    formatter.quote("Tipe: NSFW"),
                footer: config.msg.footer,
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