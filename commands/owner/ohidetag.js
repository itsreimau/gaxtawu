module.exports = {
    name: "ohidetag",
    aliases: ["oht"],
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx?.quoted?.content || formatter.quote("👋 Halo, Dunia!");

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => m.id);

            return await ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};