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

            await ctx.reply({
                text: `— ${result.quote}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Nama")}: ${result.author.name}\n` +
                    `➛ ${formatter.bold("Deskripsi")}: ${result.author.description}`,
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