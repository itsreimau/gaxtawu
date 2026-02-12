const axios = require("axios");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("deline", "/random/ppcouple");
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                album: [{
                    image: {
                        url: result.cowo
                    },
                    mimetype: tools.mime.lookup("png")
                }, {
                    image: {
                        url: result.cewe
                    },
                    mimetype: tools.mime.lookup("png")
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};