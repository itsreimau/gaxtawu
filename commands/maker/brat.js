const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "brat",
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
            const result = tools.api.createUrl("delirius", "/canvas/brat", {
                text: input
            });
            const userStickerwm = ctx.db.user?.stickerwm;
            const sticker = await new Sticker(result)
                .setPack(userStickerwm?.packname || config.sticker.packname)
                .setAuthor(userStickerwm?.author || config.sticker.author)
                .setType(StickerTypes.FULL)
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