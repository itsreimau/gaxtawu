const axios = require("axios");

module.exports = {
    name: "animeinfo",
    aliases: ["anime"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("https://api.jikan.moe", "/v4/anime", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.data[0];

            await ctx.reply({
                text: `${formatter.quote(`Judul: ${result.title}`)}\n` +
                    `${formatter.quote(`Judul Inggris: ${result.title_english}`)}\n` +
                    `${formatter.quote(`Judul Jepang: ${result.title_japanese}`)}\n` +
                    `${formatter.quote(`Tipe: ${result.type}`)}\n` +
                    `${formatter.quote(`Episode: ${result.episodes}`)}\n` +
                    `${formatter.quote(`Durasi: ${result.duration}`)}\n` +
                    `${formatter.quote(`URL: ${result.url}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    await tools.cmd.translate(result.synopsis, "id"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};