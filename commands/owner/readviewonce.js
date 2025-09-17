const { MessageType } = require("@itsreimau/gktw");

module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["audio", "image", "video"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["viewOnce"])));

        try {
            const quoted = ctx.quoted;
            const quotedType = quoted.messageType;

            if (!quoted[quotedType].viewOnce) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["viewOnce"])));

            if (quoted[quotedType].viewOnce) delete quoted[quotedType].viewOnce;
            if (quoted[quotedType].scansSidecar) delete quoted[quotedType].scansSidecar;

            await ctx.forwardMessage(ctx.id, quoted);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};