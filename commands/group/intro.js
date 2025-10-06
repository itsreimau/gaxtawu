module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const introText = ctx.db.group.text?.intro || formatter.quote("❎ Grup ini tidak memiliki intro.");

            await ctx.reply(introText);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};