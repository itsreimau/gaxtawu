const axios = require("axios");

module.exports = {
    name: "netwrck",
    category: "ai-image",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx?.quoted?.content;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/ai-img/netwrck-img", {
                text: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.result);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote(`Prompt: ${input}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};