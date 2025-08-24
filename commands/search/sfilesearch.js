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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("hang", "/search/sfile", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(res =>
                `${formatter.quote(`Nama: ${res.title}`)}\n` +
                `${formatter.quote(`Ukuran: ${res.size}`)}\n` +
                formatter.quote(`URL: ${res.link}`)
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
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