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
                username: user.username || "guest",
                level: user.level || 0,
                winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            await ctx.reply(
                `➛ ${formatter.bold("Nama")}: ${ctx.sender.pushName} (${userDb?.username})\n` +
                `➛ ${formatter.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["hari"])} tersisa` : "Selamanya"})` : "Freemium"}\n` +
                `➛ ${formatter.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                `➛ ${formatter.bold("Koin")}: ${ctx.sender.isOwner() || userDb?.premium ? "Tak terbatas" : userDb?.coin}\n` +
                `➛ ${formatter.bold("Menang")}: ${userDb?.winGame || 0}\n` +
                `➛ ${formatter.bold("Peringkat")}: ${leaderboardData.findIndex(user => user.id === ctx.sender.jid) + 1}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};