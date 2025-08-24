const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada"))
        );

        try {
            const searchResult = (await axios.get(tools.api.createUrl("https://api.vreden.my.id", "/api/search/genius/find", {
                lagu: input
            }))).data.result[0];
            const apiUrl = tools.api.createUrl("https://api.vreden.my.id", "/api/search/genius/lyrics", {
                url: searchResult.url
            });
            const result = (await axios.get(apiUrl)).data.result.lyrics;

            await ctx.reply({
                text: `${formatter.quote(`Judul: ${searchResult.title}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    result,
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};