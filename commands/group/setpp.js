module.exports = {
    name: "setpp",
    aliases: ["seticon"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            await ctx.group().updateProfilePicture(buffer);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah gambar profil grup!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};