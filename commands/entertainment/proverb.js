const axios = require("axios");

module.exports = {
    name: "proverb",
    aliases: ["peribahasa"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("http://jagokata-api.hofeda4501.serv00.net", "/peribahasa-acak.php"); // Dihosting sendiri, karena jagokata-api.rf.gd malah error
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data);

            await ctx.reply({
                text: `— ${result.kalimat}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Arti")}: ${result.arti}`,
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