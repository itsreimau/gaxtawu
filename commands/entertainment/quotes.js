const axios = require("axios");

module.exports = {
    name: "quotes",
    aliases: ["quote"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://quotes.liupurnomo.com", "/api/quotes/random");
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                text: `— ${result.text}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Oleh")}: ${result.author}\n` +
                    `➛ ${formatter.bold("Kategori")}: ${result.category}`,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
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