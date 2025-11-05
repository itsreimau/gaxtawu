module.exports = {
    name: "hijabkan",
    aliases: ["hijab", "penghijaban"],
    category: "ai-misc",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const uploadUrl = await ctx.core.rexx.utils.uploadFile(buffer);
            const result = tools.api.createUrl("zell", "/ai/hijabkan", {
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