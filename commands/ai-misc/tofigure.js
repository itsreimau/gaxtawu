module.exports = {
    name: "tofigure",
    aliases: ["jadifigure"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("gemini_antidonasi", "/figurine", {
                imageUrl: uploadUrl
            });

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};