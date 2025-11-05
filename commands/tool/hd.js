const axios = require("axios");

module.exports = {
    name: "hd",
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const uploadUrl = await ctx.core.rexx.utils.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("yp", "/api/tools/hd", {
                url: uploadUrl,
                scale: tools.cmd.getRandomElement(["2", "4", "6", "8"])
            });
            const result = (await axios.get(apiUrl)).data.result.imageUrl;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};