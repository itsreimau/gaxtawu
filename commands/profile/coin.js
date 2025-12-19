module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        if (ctx.sender.isOwner() || ctx.db.user?.premium) return await ctx.reply(`ⓘ ${formatter.italic("Anda memiliki koin tak terbatas.")}`);

        try {
            const coin = ctx.db.user.coin || 0;

            await ctx.reply(`ⓘ ${formatter.italic(`Anda memiliki ${coin} koin tersisa.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};