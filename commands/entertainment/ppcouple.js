const axios = require("axios");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/ArdyBotzz/ardy-api/refs/heads/master/src/ppcouple.json");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            await ctx.reply({
                album: [{
                    image: {
                        url: result.female
                    },
                    mimetype: tools.mime.lookup("png")
                }, {
                    image: {
                        url: result.male
                    },
                    mimetype: tools.mime.lookup("png")
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};