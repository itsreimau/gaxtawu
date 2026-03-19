module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "misc",
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio", "image", "video"])) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["viewOnce"]));

        const quotedMessage = ctx.quoted.message;

        if (!quotedMessage[ctx.quoted.messageType].viewOnce) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["viewOnce"]));

        try {
            delete quotedMessage[ctx.quoted.messageType].viewOnce;

            await ctx.forwardMessage(ctx.id, {
                message: quotedMessage
            }, true);
            await ctx.reply(`ⓘ Media sekali lihat berhasil dikirim!`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};