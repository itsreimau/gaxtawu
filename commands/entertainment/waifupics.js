const axios = require("axios");

module.exports = {
    name: "waifupics",
    aliases: ["wpics"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifupics");
            return await ctx.reply(listText);
        }

        try {
            const listWaifupics = ["waifu", "neko", "shinobu", "megumin"];
            const waifupics = listWaifupics.includes(input) ? input : tools.cmd.getRandomElement(listWaifupics);
            const apiUrl = tools.api.createUrl("https://api.waifu.pics", `/sfw/${waifupics}`);
            const result = (await axios.get(apiUrl)).data.url;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Kategori")}: ${tools.msg.ucwords(waifupics)}\n` +
                    `➛ ${formatter.bold("Tipe")}: SFW`,
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