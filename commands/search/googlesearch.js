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
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "evangelion")
        );

        try {
            const apiUrl = tools.api.createUrl("vreden", "/api/google", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result.items;

            const resultText = result.map(_result =>
                `➛ ${formatter.bold("Judul")}: ${_result.title}\n` +
                `➛ ${formatter.bold("Deskripsi")}: ${_result.snippet}\n` +
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