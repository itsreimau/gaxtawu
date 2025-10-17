const axios = require("axios");

module.exports = {
    name: "xvideossearch",
    aliases: ["xvideos", "xvideoss"],
    category: "search",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("deline", "/search/xvideos", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result.items;

            const resultText = result.map(res =>
                `${formatter.quote(`Judul: ${res.title}`)}\n` +
                `${formatter.quote(`Channel: ${res.artist}`)}\n` +
                `${formatter.quote(`Durasi: ${res.duration}`)}\n` +
                formatter.quote(`URL: ${res.link}`)
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