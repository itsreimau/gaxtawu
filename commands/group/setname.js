module.exports = {
    name: "setname",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "gaxtawu")
            );

        try {
            await ctx.group().updateSubject(input);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah nama grup!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};