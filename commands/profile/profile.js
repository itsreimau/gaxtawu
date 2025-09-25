module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        try {
            const users = await db.get("user");

            const leaderboardData = Object.entries(users).map(([id, data]) => ({
                id,
                winGame: data.winGame || 0,
                level: data.level || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userDb = await db.get(`user.${ctx.keyDb.user}`) || {};
            const isOwner = tools.cmd.isOwner(ctx.getId(ctx.sender.pn), ctx.getId(ctx.me.id), ctx.msg.key.id);

            await ctx.reply({
                text: `${formatter.quote(`Nama: ${ctx.sender.pushName} (${userDb?.username})`)}\n` +
                    `${formatter.quote(`Status: ${isOwner ? "Owner" : userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["hari"])} tersisa` : "Selamanya"})` : "Freemium"}`)}\n` +
                    `${formatter.quote(`Level: ${userDb?.level || 0} (${userDb?.xp || 0}/100)`)}\n` +
                    `${formatter.quote(`Koin: ${isOwner || userDb?.premium ? "Tak terbatas" : userDb?.coin}`)}\n` +
                    `${formatter.quote(`Menang: ${userDb?.winGame || 0}`)}\n` +
                    formatter.quote(`Peringkat: ${leaderboardData.findIndex(user => user.id === ctx.keyDb.user) + 1}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};