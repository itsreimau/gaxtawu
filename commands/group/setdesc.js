module.exports = {
    name: "setdesc",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "by itsreimau")
            );

        try {
            await ctx.group().updateDescription(input);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah deskripsi grup!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};