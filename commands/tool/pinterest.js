const axios = require("axios");

module.exports = {
    name: "pinterest",
    aliases: ["pin", "pint"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "rei ayanami"))
        );

        try {
            const apiUrl = tools.api.createUrl("izumi", "/search/pinterest", {
                query: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.result.pins).media.images.orig.url;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote(`Kueri: ${input}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};