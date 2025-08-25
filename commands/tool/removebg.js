const {
    Baileys
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "removebg",
    aliases: ["rbg"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await Baileys.uploadFile(buffer, "image");
            const apiUrl = tools.api.createUrl("izumi", "/tools/removebg", {
                imageUrl: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.imageLink;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote("Untukmu, tuan!"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};