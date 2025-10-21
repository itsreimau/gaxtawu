const axios = require("axios");

module.exports = {
    name: "youtubesearch",
    aliases: ["youtube", "youtubes", "yt", "yts", "ytsearch"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada")
        );

        try {
            const apiUrl = tools.api.createUrl("yp", "/api/search/youtube", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.results.filter(_result => _result.videoId);

            const resultText = result.map(_result =>
                `➛ ${formatter.bold("Judul")}: ${_result.title}\n` +
                `➛ ${formatter.bold("Channel")}: ${_result.channel}\n` +
                `➛ ${formatter.bold("Deskripsi")}: ${_result.description}\n` +
                `➛ ${formatter.bold("Durasi")}: ${_result.duration}\n` +
                `➛ ${formatter.bold("URL")}: ${_result.url}`
            ).join("\n");
            await ctx.reply({
                text: resultText || `ⓘ ${formatter.italic(config.msg.notFound)}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};