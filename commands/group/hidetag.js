module.exports = {
    name: "hidetag",
    aliases: ["ht"],
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || `>ᴗ< ${formatter.italic("Halo, Dunia!")}`;

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => member.jid);

            await ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};