module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getAll();
            const userDb = ctx.db.user;

            const leaderboardData = users.map(user => ({
                jid: user.jid,
                level: user.level || 0,
                winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            await ctx.reply(
                `❖ ${tools.msg.bold("Nama")}: ${ctx.sender.pushName}\n` +
                `❖ ${tools.msg.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(userDb.premiumExpiration - Date.now(), ["hari", "jam"])} tersisa` : "Selamanya"})` : "Freemium")}\n` +
                `❖ ${tools.msg.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                `❖ ${tools.msg.bold("Koin")}: ${ctx.sender.isOwner() || userDb?.premium ? "Unlimited" : (userDb?.coin || 0)}\n` +
                `❖ ${tools.msg.bold("Menang")}: ${userDb?.winGame || 0}\n` +
                `❖ ${tools.msg.bold("Peringkat")}: ${leaderboardData.findIndex(user => tools.helper.areJidsSameUser(user.jid, ctx.sender.lid)) + 1}`
            );
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};