module.exports = {
    name: "migrate",
    category: "profile",
    code: async (ctx) => {
        try {
            const senderPnId = ctx.getId(ctx.sender.pn);
            const userPnDb = await db.get(`user.${senderPnId}`)
            const senderId = ctx.getId(ctx.sender.jid);
            const userDb = await db.get(`user.${senderId}`)
            await db.set(`user.${senderId}`, {
                ...userPnDb,
                ...userDb
            });
            await db.delete(`user.${senderPnId}`);

            await ctx.reply(formatter.quote("✅ Database Anda telah berhasil dimigrasikan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};