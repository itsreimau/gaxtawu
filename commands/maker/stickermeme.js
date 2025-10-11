const { Baileys } = require("@itsreimau/gktw");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "stickermeme",
    aliases: ["smeme", "stikermeme"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot|shinji!"))
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, ["image", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["image", "sticker"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["image", "sticker"])));

        try {
            let [top, bottom] = input.split("|").map(_input => _input);
            [top, bottom] = bottom ? [top || "", bottom] : ["", top || ""];
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Baileys.uploadFile(buffer)).data.url;
            const result = tools.api.createUrl("nekolabs", `/canvas/meme/get`, {
                imageUrl: uploadUrl,
                textT: top,
                textB: bottom
            });
            const sticker = await new Sticker(result)
                .setPack(config.sticker.packname)
                .setAuthor(config.sticker.author)
                .setType(StickerTypes.FULL)
                .setCategories(["🌕"])
                .setId(ctx.msg.key.id)
                .setQuality(50)
                .build()

            await ctx.reply({
                sticker
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};