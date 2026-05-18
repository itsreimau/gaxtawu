module.exports = {
    name: "hidetag",
    aliases: ["h", "ht"],
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        try {
            await ctx.reply({
                text: input || `>ᴗ< ${formatter.italic("Halo, Dunia!")}`,
                mentionAll: true
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};