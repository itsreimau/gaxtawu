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

            await ctx.reply(tools.msg.info(`Anda akan AFK, ${input ? `dengan alasan ${tools.msg.inlineCode(input)}` : "tanpa alasan apapun"}`));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};