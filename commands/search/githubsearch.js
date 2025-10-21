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
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "gaxtawu")
        );

        try {
            const apiUrl = tools.api.createUrl("https://api.github.com", "/search/repositories", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.items;

            const resultText = result.map(_result =>
                `➛ ${formatter.bold("Nama")}: ${_result.full_name}\n` +
                `➛ ${formatter.bold("Developer")}: ${_result.author}\n` +
                `➛ ${formatter.bold("Deskripsi")}: ${_result.description}\n` +
                `➛ ${formatter.bold("Bahasa")}: ${_result.owner.login}\n` +
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