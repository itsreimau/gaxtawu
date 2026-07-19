module.exports = {
    name: "setdescription",
    aliases: ["setdesc"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "by itsreimau")
            );

        try {
            await ctx.group().updateDescription(input);

            await ctx.reply(ctx.msg.info("Berhasil mengubah deskripsi grup!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};