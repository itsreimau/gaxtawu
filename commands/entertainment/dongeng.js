const axios = require("axios");

module.exports = {
    name: "dongeng",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("zell", "/random/dongeng");
            const result = (await axios.get(apiUrl)).data;

            await ctx.reply({
                text: `— ${result.storyContent}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Judul")}: ${result.title}\n` +
                    `➛ ${formatter.bold("Pengarang")}: ${result.author}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};