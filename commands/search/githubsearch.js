const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["github", "githubs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "gaxtawu"))
        );

        try {
            const apiUrl = tools.api.createUrl("https://api.github.com", "/search/repositories", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.items;

            const resultText = result.map(res =>
                `${formatter.quote(`Nama: ${res.full_name}`)}\n` +
                `${formatter.quote(`Deskripsi: ${res.description}`)}\n` +
                `${formatter.quote(`Developer: ${res.author}`)}\n` +
                `${formatter.quote(`Bahasa: ${res.owner.login}`)}\n` +
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