const axios = require("axios");

module.exports = {
    name: "pinterest",
    aliases: ["pin"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "rei ayanami")
            );

        try {
            const apiUrl = tools.api.createUrl("vreden", "/api/v2/search/pinterest", {
                query: input,
                limit: 100,
                type: "pins"
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.result.result).media_urls[0].url;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `➛ ${formatter.bold("Kueri")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};