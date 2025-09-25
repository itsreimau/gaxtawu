module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        const userDb = await db.get(`user.${ctx.keyDb.user}`) || {};

        if (tools.cmd.isOwner(ctx.keyDb.user, ctx.getId(ctx.me.id), ctx.msg.key.id) || userDb?.premium) return await ctx.reply(formatter.quote("🤑 Anda memiliki koin tak terbatas."));

        try {
            const userCoin = userDb?.coin || 0;

            await ctx.reply(formatter.quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};