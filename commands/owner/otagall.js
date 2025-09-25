module.exports = {
    name: "otagall",
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || formatter.quote("👋 Halo, Dunia!");

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => {
                const serialized = ctx.getId(member.id);
                return {
                    tag: `@${serialized}`,
                    mention: member.id
                };
            });

            const resultText = mentions.map(mention => mention.tag).join(" ");
            await ctx.reply({
                text: `${input}\n` +
                    `${config.msg.readmore}· · ─ ·✶· ─ · ·\n` +
                    resultText,
                mentions: mentions.map(mention => mention.mention)
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};