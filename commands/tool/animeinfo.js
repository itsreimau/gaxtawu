const axios = require("axios");

module.exports = {
    name: "animeinfo",
    aliases: ["anime"],
    category: "tool",
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
            const apiUrl = tools.api.createUrl("https://api.jikan.moe", "/v4/anime", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.data[0];

            await ctx.reply(
                `— ${result.synopsis}\n` +
                "\n" +
                `➛ ${formatter.bold("Judul")}: ${result.title}\n` +
                `➛ ${formatter.bold("Tipe")}: ${result.type}\n` +
                `➛ ${formatter.bold("Episode")}: ${result.episodes}\n` +
                `➛ ${formatter.bold("Durasi")}: ${result.duration}\n` +
                `➛ ${formatter.bold("URL")}: ${result.url}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};