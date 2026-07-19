module.exports = {
    name: "ocr",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["image"]);

        if (!isMedia) return await ctx.reply(ctx.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = ctx.api.createUrl("nexray", "/tools/ocr", {
                url: uploadUrl
            });
            const result = (await ctx.request.get(apiUrl)).data.result.text;

            await ctx.reply(result);
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};