module.exports = {
    name: "tagall",
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || `>ᴗ< ${formatter.italic("Halo, Dunia!")}`;

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => {
                const serialized = ctx.getId(member.jid);
                return {
                    tag: `@${serialized}`,
                    mention: member.jid
                };
            });

            const resultText = mentions.map(mention => mention.tag).join(" ");
            await ctx.reply({
                text: `${input}\n` +
                    `${"\u200E".repeat(4001)}\n` +
                    resultText,
                mentions: mentions.map(mention => mention.mention)
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};