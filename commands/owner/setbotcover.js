module.exports = {
    name: "setbotcover",
    aliases: ["setcoverbot"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["image"]);

        if (!isMedia) return await ctx.reply(ctx.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            await ctx.core.updateCoverPhoto(buffer);

            await ctx.reply(ctx.msg.info("Berhasil mengubah gambar sampul bot!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};