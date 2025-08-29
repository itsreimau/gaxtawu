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
            const apiUrl = tools.api.createUrl("neko", "/search/github-search", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(res =>
                `${formatter.quote(`Nama: ${res.full_name}`)}\n` +
                `${formatter.quote(`Deskripsi: ${res.description}`)}\n` +
                `${formatter.quote(`Jumlah: ${res.stars} stargazers, ${res.forks} forks`)}\n` +
                `${formatter.quote(`Bahasa: ${res.language}`)}\n` +
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