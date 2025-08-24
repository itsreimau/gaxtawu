module.exports = {
    name: "tagme",
    category: "group",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        await ctx.reply({
            text: `@${ctx.getId(ctx.sender.jid)}`,
            mentions: [ctx.sender.jid]
        });
    }
};