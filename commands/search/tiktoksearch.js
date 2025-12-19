const axios = require("axios");

module.exports = {
    name: "tiktoksearch",
    aliases: ["tiktoks", "ttsearch"],
    category: "search",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "evangelion")
            );

        try {
            const apiUrl = tools.api.createUrl("znx", "/api/search/tiktok", {
                q: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.results).play;

            await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: `➛ ${formatter.bold("Kueri")}: ${input}`,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
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