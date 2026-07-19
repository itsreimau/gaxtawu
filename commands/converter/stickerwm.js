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
                `${ctx.text.generateInstruction(["send", "reply"], ["text", "sticker"])}\n` +
                ctx.text.generateCmdExample(ctx.used, "stiker saya|itsreimau")
            );

        const isMedia = ctx.isMedia(["sticker"]);

        if (!isMedia) return await ctx.reply(ctx.text.generateInstruction(["reply"], ["sticker"]));

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
            await ctx.helper.handleError(ctx, error);
        }
    }
};