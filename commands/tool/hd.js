const axios = require("axios");

module.exports = {
    name: "hd",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("delirius", "/ia/enhance", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.data.url;

            await ctx.reply({
                image: {
                    url: result
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};