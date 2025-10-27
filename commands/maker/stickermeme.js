const { Gktw } = require("@itsreimau/gktw");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "stickermeme",
    aliases: ["smeme", "stikermeme"],
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "get in the fucking robot|shinji!")
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, ["image", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["image", "sticker"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image", "sticker"]));

        try {
            let [top, bottom] = input.split("|").map(inp => inp);
            [top, bottom] = bottom ? [top || "_", bottom] : ["_", top || "_"];
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Gktw.uploadFile(buffer)).data.url;
            const result = tools.api.createUrl("https://api.memegen.link", `/images/custom/${top}${bottom}.png`, {
                background: uploadUrl
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