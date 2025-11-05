const axios = require("axios");

module.exports = {
    name: "ocr",
    aliases: ["image2text", "imagetotext", "img2text", "imgtotext", "read", "readtext", "totext"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const uploadUrl = await ctx.core.rexx.utils.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("deline", "/tools/ocr", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.Text;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};