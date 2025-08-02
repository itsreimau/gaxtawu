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

            return await ctx.reply({
                text: `${formatter.quote(`Kalimat: ${result.kalimat}`)}\n` +
                    formatter.quote(`Arti: ${result.arti}`),
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