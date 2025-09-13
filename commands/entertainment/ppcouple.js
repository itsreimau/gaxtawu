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
            const apiUrl = tools.api.createUrl("kyyokatsu", "/random/ppcp");
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                album: [{
                    image: {
                        url: result.cowo
                    },
                    mimetype: tools.mime.lookup("jpeg")
                }, {
                    image: {
                        url: result.cewe
                    },
                    mimetype: tools.mime.lookup("jpeg")
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};