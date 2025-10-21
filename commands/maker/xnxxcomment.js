const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "xnxxcomment",
    aliases: ["xnxxc"],
    category: "maker",
    permissions: {
        coin: 10
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
            const isQuoted = ctx.args.length === 0 && ctx.quoted;
            const result = tools.api.createUrl("deline", "/maker/fake-xnxx", {
                name: isQuoted ? ctx.quoted?.pushName : ctx.sender.pushName,
                quote: input,
                likes: Math.floor(Math.random() * 10) + 1,
                dislikes: 0
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