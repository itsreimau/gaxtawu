module.exports = {
    name: "hdvideo",
    aliases: ["hdvid"],
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["video"]);

        if (!isMedia) return await ctx.reply(ctx.msg.generateInstruction(["send", "reply"], ["video"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = ctx.api.createUrl("nexray", "/tools/hdvideo", {
                url: uploadUrl
            });
            const result = (await ctx.request.get(apiUrl)).data.result;

            await ctx.reply({
                video: {
                    url: result
                }
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};