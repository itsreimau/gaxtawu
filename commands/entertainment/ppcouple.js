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
            const apiUrl = tools.api.createUrl("https://sandipbaruwal.onrender.com", "/dp");
            const result = (await axios.get(apiUrl)).data;

            return await ctx.core.sendAlbumMessage(ctx.id, [{
                    image: {
                        url: result.male
                    },
                    mimetype: tools.mime.lookup("jpg")
                },
                {
                    image: {
                        url: result.female
                    },
                    mimetype: tools.mime.lookup("jpg")
                }
            ], {
                quoted: ctx.msg
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};