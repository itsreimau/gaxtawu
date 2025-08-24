module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        const senderId = ctx.getId(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.cmd.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(formatter.quote("🤑 Kamu memiliki koin tak terbatas."));

        try {
            const userCoin = userDb?.coin || 0;

            await ctx.reply(formatter.quote(`💰 Kamu memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};