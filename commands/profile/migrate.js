module.exports = {
    name: "migrate",
    category: "profile",
    code: async (ctx) => {
        try {
            const senderId = ctx.getId(ctx.sender.jid);
            const senderLidId = ctx.getId(ctx.sender.lid);
            const userDb = await db.get(`user.${senderId}`)
            const userDbLid = await db.get(`user.${senderLidId}`)
            await db.set(`user.${senderLidId}`, {
                ...userDb,
                ...userDbLid
            });
            await db.delete(`user.${senderId}`);

            await ctx.reply(formatter.quote("✅ Database Anda telah berhasil dimigrasikan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};