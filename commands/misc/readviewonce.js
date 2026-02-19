module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "misc",
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio", "image", "video"])) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["audio", "image", "video"]));

        const quoted = ctx.quoted;
        const quotedType = quoted.messageType;

        if (!quoted[quotedType].viewOnce) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["audio", "image", "video"]));

        try {
            delete quoted[quotedType].viewOnce;

            await ctx.forwardMessage(ctx.id, quoted);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};