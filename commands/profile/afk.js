module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text;

        try {
            const senderDb = ctx.db.user;
            senderDb.afk = {
                reason: input,
                timestamp: Date.now()
            };
            senderDb.save();

            await ctx.reply(ctx.text.info(`Anda akan AFK, ${input ? `dengan alasan ${ctx.text.inlineCode(input)}` : "tanpa alasan apapun"}`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};