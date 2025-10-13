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
                text: `${formatter.quote(`Judul: ${result.title}`)}\n` +
                    `${formatter.quote(`Pengarang: ${result.author}`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    result.storyContent,
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};