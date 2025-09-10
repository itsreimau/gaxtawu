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
            const apiUrl = tools.api.createUrl("ryzumi", "api/search/lyrics", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data[0];

            await ctx.reply({
                text: `${formatter.quote(`Judul: ${result.trackName}`)}\n` +
                    `${formatter.quote(`Artis: ${result.artistName}`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    result.plainLyrics,
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};