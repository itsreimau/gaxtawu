const { Gktw } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "ocr",
    aliases: ["image2text", "imagetotext", "img2text", "imgtotext"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Gktw.uploadFile(buffer)).data.url;
            const apiUrl = tools.api.createUrl("hang", "/tools/ocr", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};