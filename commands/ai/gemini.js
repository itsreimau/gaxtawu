module.exports = {
    name: "gemini",
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.text.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                ctx.text.generateNotes([
                    "AI ini dapat melihat gambar."
                ])
            );

        const isMedia = ctx.isMedia(["image"]);

        try {
            if (!!isMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = ctx.api.createUrl("lexcode", "/api/ai/gemini-2-5-flash", {
                    text: input,
                    imgUrl: uploadUrl
                });
                const result = (await ctx.request.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = ctx.api.createUrl("lexcode", "/api/ai/gemini-2-5-flash", {
                    text: input
                });
                const result = (await ctx.request.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};