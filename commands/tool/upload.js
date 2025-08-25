const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "upload",
    aliases: ["tourl"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, ["audio", "document", "image", "video", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["audio", "document", "image", "video", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "video", "sticker"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const result = await Baileys.uploadFile(buffer);

            await ctx.reply({
                text: formatter.quote(`URL: ${result}`),
                footer: config.msg.footer,
                interactiveButtons: [{
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Salin URL",
                        copy_code: result
                    })
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};