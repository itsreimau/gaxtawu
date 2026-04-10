module.exports = {
    name: "listpendingmembers",
    aliases: ["pendingmembers"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const pendings = await ctx.group().pendingMembers();
            const resultText = pendings.map(pending => `➛ ${ctx.getId(pending.id)}`).join("\n");

            await ctx.reply(resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};