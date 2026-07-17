module.exports = {
    name: "upload",
    aliases: ["up", "tourl"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.helper.checkMedia(ctx.msg.messageType, ["audio", "document", "image", "sticker", "video"]),
            tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["audio", "document", "image", "sticker", "video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "sticker", "video"]));

        try {
            const result = await ctx.msg.upload() || await ctx.quoted.upload();

            await ctx.reply({
                text: `❖ ${tools.msg.bold("URL")}: ${result}`,
                footer: tools.msg.info("File akan kedaluwarsa setelah 3 jam."),
                nativeFlow: [{
                    text: "Salin URL",
                    copy: result
                }]
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};