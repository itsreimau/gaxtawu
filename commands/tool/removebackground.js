module.exports = {
    name: "removebackground",
    aliases: ["removebg"],
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
            const result = tools.api.createUrl("nexray", "/tools/removebg", {
                url: uploadUrl
            });

            await ctx.reply({
                document: {
                    url: result
                },
                fileName: `${Math.random().toString(36).substring(2, 15)}.png`,
                mimetype: "image/png"
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};