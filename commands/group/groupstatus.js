const { MessageType } = require("@itsreimau/gktw");

module.exports = {
    name: "groupstatus",
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "halo, dunia!")
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image", "video"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image", "video")
        ];

        try {
            const media = await ctx.msg.media.toBuffer() ? ctx.msg.media : ctx.quoted.media;
            const buffer = await media?.toBuffer();
            const type = checkMedia || checkQuotedMedia;
            const content = buffer && [MessageType.imageMessage, MessageType.videoMessage].includes(type) ? {
                [type === MessageType.imageMessage ? "image" : "video"]: buffer,
                caption: input
            } : {
                text: input
            };
            await ctx.core.rexx.handleGroupStory({
                groupStatusMessage: content
            }, ctx.id);

            await ctx.reply(`✅ Group status berhasil dikirim!`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false);
        }
    }
};