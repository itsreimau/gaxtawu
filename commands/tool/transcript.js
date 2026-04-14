const axios = require("axios");

module.exports = {
    name: "transcript",
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["audio"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["audio"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("otinxsandip", "/des", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.transcript;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};