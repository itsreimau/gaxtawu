module.exports = {
    name: "setbotpp",
    aliases: ["setboticon", "seticonbot", "setppbot"],
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
            const image = checkMedia ? ctx.msg.message.imageMessage : ctx.quoted.message.imageMessage;
            const dimensions = tools.helper.calculateDimensions(image.width, image.height);
            await ctx.core.updateProfilePicture(ctx.me.id, buffer, dimensions);

            await ctx.reply(tools.msg.info("Berhasil mengubah gambar profil bot!"));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};