module.exports = {
    name: "upload",
    aliases: ["up", "tourl"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["audio", "document", "image", "sticker", "video"]);

        if (!isMedia) return await ctx.reply(ctx.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "sticker", "video"]));

        try {
            const result = await ctx.msg.upload() || await ctx.quoted.upload();

            await ctx.reply({
                text: `❖ ${ctx.msg.bold("URL")}: ${result}`,
                footer: ctx.msg.info("File akan kedaluwarsa setelah 3 jam."),
                nativeFlow: [{
                    text: "Salin URL",
                    copy: result
                }]
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};