const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "bratgif",
    aliases: ["bratg", "bratv", "bratvid", "bratvideo", "sbratgif", "sbratvid", "sbratvideo", "stickerbratgif", "stickerbratvid", "stickerbratvideo", "stikerbratgif", "stikerbratvid", "stikerbratvideo"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 1000) return await ctx.reply(formatter.quote("❎ Maksimal 1000 kata!"));

        try {
            const result = tools.api.createUrl("yp", "/api/video/bratv", {
                text: input
            });
            const sticker = new Sticker(result, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            await ctx.reply(await sticker.toMessage());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};