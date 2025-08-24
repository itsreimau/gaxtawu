module.exports = {
    name: "setdesc",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "by itsreimau"))
        );

        try {
            await ctx.group().updateDescription(input);

            await ctx.reply(formatter.quote("✅ Berhasil mengubah deskripsi grup!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};