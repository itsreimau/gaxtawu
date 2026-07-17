module.exports = {
    name: "sticker",
    aliases: ["s", "stiker"],
    category: "converter",
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.helper.checkMedia(ctx.msg.messageType, ["image", "video"]),
            tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["image", "video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image", "video"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const [packname, author] = ctx.text?.split("|");

            await ctx.reply({
                sticker: buffer
            }, {
                pack: packname || config.sticker.packname,
                author: author || config.sticker.author
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};