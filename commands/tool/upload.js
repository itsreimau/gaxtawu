module.exports = {
    name: "upload",
    aliases: ["up", "tourl"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["audio", "document", "image", "sticker", "video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio", "document", "image", "sticker", "video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "sticker", "video"]));

        try {
            const result = await ctx.msg.upload() || await ctx.quoted.upload();

            await ctx.reply({
                text: `➛ ${formatter.bold("URL")}: ${result}`,
                interactiveButtons: [{
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Salin URL",
                        copy_code: result
                    })
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};