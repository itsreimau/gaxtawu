module.exports = {
    name: "afk",
    aliases: ["turu"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        try {
            const userDb = ctx.db.user;
            const reason = ctx.used.command === "turu" ? "turu" : input;
            userDb.afk = {
                reason: reason,
                timestamp: Date.now()
            };
            userDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Anda akan AFK, ${input ? `dengan alasan ${formatter.inlineCode(input)}` : "tanpa alasan apapun"}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};