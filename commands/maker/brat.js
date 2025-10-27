const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "brat",
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        if (input.length > 1000) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 1000 kata!")}`);

        try {
            const result = tools.api.createUrl("yp", "/api/image/brat", {
                text: input
            });
            const sticker = await new Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
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