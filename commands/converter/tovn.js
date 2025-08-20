module.exports = {
    name: "tovn",
    aliases: ["toptt"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx?.quoted.contentType, ["audio"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["audio"])));

        try {
            const result = await ctx.quoted.media.toBuffer();

            return await ctx.reply({
                audio: result,
                mimetype: tools.mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};