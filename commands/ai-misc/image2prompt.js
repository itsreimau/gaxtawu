const {
    Baileys
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "image2prompt",
    aliases: ["imagetoprompt", "img2prompt", "imgtoprompt"],
    category: "ai-misc",
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
            const uploadUrl = await Baileys.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("zenzxz", "/tools/toprompt", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};