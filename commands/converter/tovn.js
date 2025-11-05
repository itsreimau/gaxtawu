module.exports = {
    name: "tovn",
    aliases: ["toptt"],
    category: "converter",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio"])) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["audio"]));

        try {
            const result = await ctx.quoted.download();

            await ctx.reply({
                audio: result,
                mimetype: tools.mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};