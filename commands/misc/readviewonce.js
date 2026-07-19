module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "misc",
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["audio", "image", "video"]);

        if (!isMedia) return await ctx.reply(ctx.text.generateInstruction(["reply"], ["audio", "image", "video"]));

        const quotedMessage = ctx.quoted.message;

        if (!quotedMessage[ctx.quoted.messageType].viewOnce) return await ctx.reply(ctx.text.generateInstruction(["reply"], ["viewOnce"]));

        try {
            delete quotedMessage[ctx.quoted.messageType].viewOnce;

            await ctx.sendMessage(ctx.id, {
                ...quotedMessage,
                raw: true
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};