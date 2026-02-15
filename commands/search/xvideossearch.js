const axios = require("axios");

module.exports = {
    name: "xvideossearch",
    aliases: ["xvideos", "xvideoss"],
    category: "search",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "evangelion")
            );

        const isUrl = tools.cmd.isUrl(input);
        if (isUrl)
            return await ctx.reply({
                text: `ⓘ ${formatter.italic("Input berupa URL, gunakan tombol download di bawah:")}`,
                buttons: [{
                    buttonId: `${ctx.used.prefix}xvideosdl ${input}`,
                    buttonText: {
                        displayText: "Download"
                    }
                }]
            });

        try {
            const apiUrl = tools.api.createUrl("deline", "/search/xvideos", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result.items;

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Judul")}: ${res.title}\n` +
                `➛ ${formatter.bold("Channel")}: ${res.artist}\n` +
                `➛ ${formatter.bold("Durasi")}: ${res.duration}\n` +
                `➛ ${formatter.bold("URL")}: ${res.url}`
            ).join("\n\n");
            await ctx.reply(resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};