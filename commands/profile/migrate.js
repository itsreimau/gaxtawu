module.exports = {
    name: "migrate",
    category: "profile",
    code: async (ctx) => {
        try {
            const senderId = ctx.getId(ctx.sender.jid);
            const _senderId = ctx.getId(ctx.sender.lid);
            const userDb = await db.get(`user.${senderId}`)
            const _userDb = await db.get(`user.${_senderId}`)
            await db.set(`user.${_senderId}`, {
                ...userDb,
                ..._userDb
            });
            await db.delete(`user.${senderId}`);

            await ctx.reply(formatter.quote("✅ Database Anda telah berhasil dimigrasikan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};