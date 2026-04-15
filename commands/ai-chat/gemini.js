const axios = require("axios");

module.exports = {
    name: "gemini",
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                tools.msg.generateNotes(["AI ini dapat melihat gambar."])
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        try {
            const model = "gemini-2.0-flash";

            if (!!checkMedia || !!checkQuotedMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = tools.api.createUrl("zenzxz", "/ai/gemini", {
                    q: input,
                    model,
                    url: uploadUrl
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply({
                    richResponse: [{
                        text: result
                    }]
                });
            } else {
                const apiUrl = tools.api.createUrl("zenzxz", "/ai/gemini", {
                    q: input,
                    model
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply({
                    richResponse: [{
                        text: result
                    }]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};