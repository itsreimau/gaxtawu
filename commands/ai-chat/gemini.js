module.exports = {
    name: "gemini",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                tools.msg.generateNotes([
                    "AI ini dapat melihat gambar."
                ])
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        try {
            if (!!checkMedia || !!checkQuotedMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = tools.api.createUrl("lexcode", "/api/ai/gemini-2-5-flash", {
                    text: input,
                    imgUrl: uploadUrl
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("lexcode", "/api/ai/gemini-2-5-flash", {
                    text: input
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};