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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada"))
        );

        try {
            const apiUrl = tools.api.createUrl("yp", "/api/search/youtube", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.results.filter(res => res.videoId);;

            const resultText = result.map(res =>
                `${formatter.quote(`Judul: ${res.title}`)}\n` +
                `${formatter.quote(`Deskripsi: ${res.description}`)}\n` +
                `${formatter.quote(`Channel: ${res.channel}`)}\n` +
                `${formatter.quote(`Durasi: ${res.duration}`)}\n` +
                formatter.quote(`URL: ${res.url}`)
            ).join(
                "\n" +
                `${formatter.quote("· · ─ ·✶· ─ · ·")}\n`
            );
            await ctx.reply({
                text: resultText || config.msg.notFound,
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};