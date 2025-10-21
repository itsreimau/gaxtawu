const axios = require("axios");

module.exports = {
    name: "fufufafa",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://fufufafapi.vanirvan.my.id", "/api");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            await ctx.reply({
                image: {
                    url: result.image_url
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Doksli")}: ${result.doksli}`,
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