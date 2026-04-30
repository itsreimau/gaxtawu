module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const introText = ctx.db.group.text?.intro;

            await ctx.reply(introText || tools.msg.info("Grup ini tidak memiliki intro."));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};