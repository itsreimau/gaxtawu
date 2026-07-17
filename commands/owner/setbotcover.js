module.exports = {
    name: "setbotcover",
    aliases: ["setcoverbot"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.helper.checkMedia(ctx.msg.messageType, ["image"]),
            tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            await ctx.core.updateCoverPhoto(buffer);

            await ctx.reply(tools.msg.info("Berhasil mengubah gambar sampul bot!"));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};