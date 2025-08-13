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

            const resultText = result.map(r =>
                `${formatter.quote(`Nama: ${r.full_name}`)}\n` +
                `${formatter.quote(`Deskripsi: ${r.description}`)}\n` +
                `${formatter.quote(`Jumlah: ${r.stars} stargazers, ${r.forks} forks`)}\n` +
                `${formatter.quote(`Bahasa: ${r.language}`)}\n` +
                formatter.quote(`URL: ${r.url}`)
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
            );
            return await ctx.reply({
                text: resultText || config.msg.notFound,
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};