const axios = require("axios");

module.exports = {
    name: "googlesearch",
    aliases: ["google", "googles"],
    category: "search",
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
            const apiUrl = tools.api.createUrl("vreden", "/api/google", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result.items;

            const resultText = result.map(res =>
                `${formatter.quote(`Judul: ${res.title}`)}\n` +
                `${formatter.quote(`Deskripsi: ${res.snippet}`)}\n` +
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