const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/HasamiAini/Bot_Takagisan/refs/heads/main/faktanya.txt");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.trim().split("\n").filter(Boolean));

            await ctx.reply({
                text: result,
                buttons: [{
                    text: "Ambil Lagi",
                    id: ctx.used.prefix + ctx.used.command
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};