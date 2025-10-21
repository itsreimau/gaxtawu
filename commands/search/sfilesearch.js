const axios = require("axios");

module.exports = {
    name: "sfilesearch",
    aliases: ["sfile", "sfiles"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "evangelion")
        );

        try {
            const apiUrl = tools.api.createUrl("hang", "/search/sfile", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(_result =>
                `➛ ${formatter.bold("Nama")}: ${_result.title}\n` +
                `➛ ${formatter.bold("Ukuran")}: ${_result.size}\n` +
                `➛ ${formatter.bold("URL")}: ${_result.link}`
            ).join("\n");
            await ctx.reply({
                text: resultText || `ⓘ ${formatter.italic(config.msg.notFound)}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};