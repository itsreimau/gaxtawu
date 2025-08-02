const axios = require("axios");

module.exports = {
    name: "quotes",
    aliases: ["quote"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("http://jagokata-api.hofeda4501.serv00.net", "/acak.php"); // Dihosting sendiri, karena jagokata-api.rf.gd malah error
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data.quotes);

            return await ctx.reply({
                text: `${formatter.quote(`“${result.quote}”`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Nama: ${result.author.name}`)}\n` +
                    formatter.quote(`Deskripsi: ${result.author.description}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
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