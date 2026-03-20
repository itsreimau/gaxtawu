module.exports = {
    name: "hidetag",
    aliases: ["h", "ht"],
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => member.id);

            await ctx.reply({
                text: input || `>ᴗ< ${formatter.italic("Halo, Dunia!")}`,
                mentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};