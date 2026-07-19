module.exports = {
    name: "setname",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "nirwabot")
            );

        try {
            await ctx.group().updateSubject(input);

            await ctx.reply(ctx.msg.info("Berhasil mengubah nama grup!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};