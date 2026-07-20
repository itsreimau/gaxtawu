module.exports = {
    name: "sticker",
    aliases: ["s", "stiker"],
    category: "converter",
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["image", "video"]);

        if (!isMedia) return await ctx.reply(ctx.format.generateInstruction(["send", "reply"], ["image", "video"]));

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
            await ctx.helper.handleError(ctx, error);
        }
    }
};