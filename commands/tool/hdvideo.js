module.exports = {
    name: "hdvideo",
    aliases: ["hdvid"],
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["video"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("nexray", "/tools/hdvideo", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                video: {
                    url: result
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};