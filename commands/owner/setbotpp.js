module.exports = {
    name: "setbotpp",
    aliases: ["setboticon", "seticonbot", "setppbot"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            await ctx.core.updateProfilePicture(ctx.me.id, buffer);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah gambar profil bot!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};