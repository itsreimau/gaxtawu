module.exports = {
    name: "leaderboard",
    aliases: ["lb", "peringkat"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = await db.get("user");

            const leaderboardData = Object.entries(users).map(([id, data]) => ({
                id,
                username: data.username || "guest",
                level: data.level || 0,
                winGame: data.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => user.id === ctx.keyDb.user) + 1;
            const topUsers = leaderboardData.slice(0, 10);
            let resultText = "";

            topUsers.forEach((user, index) => {
                const isSelf = user.id === ctx.keyDb.user;
                const displayName = isSelf ? `@${user.id}` : user.username ? user.username : `${user.id}`;
                resultText += formatter.quote(`${index + 1}. ${displayName} - Menang: ${user.winGame}, Level: ${user.level}\n`);
            });

            if (userRank > 10) {
                const userStats = leaderboardData[userRank - 1];
                const displayName = `@${ctx.keyDb.user}`;
                resultText += formatter.quote(`${userRank}. ${displayName} - Menang: ${userStats.winGame}, Level: ${userStats.level}\n`);
            }

            await ctx.reply({
                text: resultText.trim(),
                mentions: [ctx.sender.jid],
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};