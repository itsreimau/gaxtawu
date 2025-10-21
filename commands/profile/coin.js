module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        if (ctx.citation.isOwner) return await ctx.reply(`ⓘ ${formatter.italic("Anda memiliki koin tak terbatas.")}`);

        try {
            const userCoin = ctx.db.user.coin || 0;

            await ctx.reply(`ⓘ ${formatter.italic(`Anda memiliki ${userCoin} koin tersisa.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};