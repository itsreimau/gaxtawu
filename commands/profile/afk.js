module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        try {
            const userDb = ctx.db.user;
            userDb.afk = {
                reason: input,
                timestamp: Date.now()
            };
            userDb.save();

            await ctx.reply(formatter.quote(`📴 Anda akan AFK, ${input ? `dengan alasan ${formatter.inlineCode(input)}` : "tanpa alasan apapun"}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};