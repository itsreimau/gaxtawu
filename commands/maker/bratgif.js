const WASF = require("wa-sticker-formatter");

module.exports = {
    name: "bratgif",
    aliases: ["bratvid", "bratvideo"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!")
            );

        if (input.length > 1000) return await ctx.reply(tools.msg.info("Maksimal 1000 karakter!"));

        try {
            const result = tools.api.createUrl("delirius", "/canvas/bratvideo", {
                text: input
            });
            const sticker = await new WASF.Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(WASF.StickerTypes.FULL)
                .setCategories(["🌕"])
                .setID(ctx.msg.key.id)
                .setQuality(50)
                .build();

            await ctx.reply({
                sticker
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};