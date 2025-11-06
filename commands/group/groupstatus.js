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
            tools.cmd.checkMedia(ctx.msg.messageType, "image", "video"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image", "video")
        ];

        try {
            const buffer = await ctx.msg.download() ? await ctx.msg.download() : await ctx.quoted.download();
            const type = checkMedia || checkQuotedMedia;
            const content = buffer && ["image", "video"].includes(type) ? {
                [type]: buffer,
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