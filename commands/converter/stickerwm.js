module.exports = {
    name: "stickerwm",
    aliases: ["take", "swm", "stikerwm"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send", "reply"], ["text", "sticker"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "stiker saya|itsreimau")
            );

        if (!tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["sticker"])) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["sticker"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const [packname, author] = input.split("|");

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