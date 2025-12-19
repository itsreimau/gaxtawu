module.exports = {
    name: "groupstatus",
    aliases: ["upswgc"],
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image", "video"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image", "video")
        ];

        const type = checkMedia || checkQuotedMedia;

        if (!input && !type)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "halo, dunia!")
            );

        try {
            const type = checkMedia || checkQuotedMedia;
            let content;
            if (["image", "video"].includes(type)) {
                const buffer = await ctx.msg.download() || await ctx.quoted.download();
                content = {
                    [type]: buffer,
                    caption: input
                };
            } else {
                content = {
                    text: input
                };
            }
            await ctx.reply({
                groupStatusMessage: content
            });

            await ctx.reply(`ⓘ Group status berhasil dikirim!`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false);
        }
    }
};