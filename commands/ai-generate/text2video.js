const axios = require("axios");

module.exports = {
    name: "text2video",
    aliases: ["text2vid", "texttovideo", "texttovid"],
    category: "ai-generate",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair")
            );

        try {
            const apiUrl = tools.api.createUrl("bagus", "/api/tools/text2video", {
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.video.url;

            await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: `➛ ${formatter.bold("Prompt")}: ${input}`,
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