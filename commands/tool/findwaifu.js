const axios = require("axios");

module.exports = {
    name: "findwaifu",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx?.quoted?.contentType, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("neko", "/tools/find-waifu", {
                imageUrl: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.character.name;

            return await ctx.reply(tools.msg.ucwords(result));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};