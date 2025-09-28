const axios = require("axios");

module.exports = {
    name: "sora",
    category: "ai-generate",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("kyyokatsu", "/ai/txt2video", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.videoUrl;

            await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4"),
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};