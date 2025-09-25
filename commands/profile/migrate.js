module.exports = {
    name: "migrate",
    category: "profile",
    code: async (ctx) => {
        try {
            const userPnDb = await db.get(`user.${ctx.keyDb.userPn}`)
            const userDb = await db.get(`user.${ctx.keyDb.user}`)
            await db.set(`user.${ctx.keyDb.user}`, {
                ...userPnDb,
                ...userDb
            });
            await db.delete(`user.${ctx.keyDb.userPn}`);

            await ctx.reply(formatter.quote("✅ Database Anda telah berhasil dimigrasikan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};