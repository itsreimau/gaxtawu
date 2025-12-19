module.exports = {
    name: "setmaxwarnings",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = parseInt(ctx.args[0], 10) || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "8")
            );

        try {
            const groupDb = ctx.db.group;
            groupDb.maxwarnings = input;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah max warnings!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};