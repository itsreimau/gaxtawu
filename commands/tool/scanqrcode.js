module.exports = {
    name: "scanqrcode",
    aliases: ["scanqr"],
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
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/tools/qr2text", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.text;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};