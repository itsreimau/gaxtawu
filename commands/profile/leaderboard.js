module.exports = {
    name: "leaderboard",
    aliases: ["lb", "peringkat"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getAll();
            const senderJid = ctx.sender.jid;

            const leaderboardData = users.map(user => ({
                jid: user.jid,
                username: user.username || "guest",
                level: user.level || 0,
                winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => user.jid === senderJid) + 1;
            const topUsers = leaderboardData.slice(0, 10);
            let resultText = "";

            topUsers.forEach((user, index) => {
                const isSelf = user.jid === senderJid;
                const displayName = isSelf ? `@${user.jid}` : user.username ? user.username : user.jid;
                resultText += `➛ ${displayName} - Menang: ${user.winGame}, Level: ${user.level}, Peringkat: ${index + 1}\n`;
            });

            if (userRank > 10) {
                const userStats = leaderboardData[userRank - 1];
                const displayName = `@${senderJid}`;
                resultText += `➛ ${displayName} - Menang: ${userStats.winGame}, Level: ${userStats.level}, Peringkat: ${userRank}\n`;
            }

            await ctx.reply({
                text: resultText.trim(),
                mentions: [senderJid]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};