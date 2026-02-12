const axios = require("axios");

module.exports = {
    name: "meme",
    aliases: ["memes"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random");
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Sumber")}: ${result.source}`,
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