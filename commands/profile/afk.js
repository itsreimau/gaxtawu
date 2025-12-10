module.exports = {
    name: "afk",
    aliases: ["turu"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text || null;

        try {
            const senderDb = ctx.db.user;
            const reason = ctx.used.command === "turu" ? "turu" : input;
            senderDb.afk = {
                reason,
                timestamp: Date.now()
            };
            senderDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Anda akan AFK, ${reason ? `dengan alasan ${formatter.inlineCode(reason)}` : "tanpa alasan apapun"}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};