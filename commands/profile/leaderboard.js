module.exports = {
    name: "leaderboard",
    aliases: ["lb", "peringkat"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getAll();
            const senderLid = ctx.sender.lid;
            const senderId = ctx.getId(senderLid);

            const leaderboardData = users.map(user => ({
                jid: user.jid,
                pushName: user.pushName,
                level: user.level || 0,
                winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => tools.cmd.areJidsSameUser(user.jid, senderLid)) + 1;
            const topUsers = leaderboardData.slice(0, 10);
            let resultText = "";

            topUsers.forEach((user, i) => {
                const isSelf = tools.cmd.areJidsSameUser(user.jid, senderLid);
                const displayUser = isSelf ? `@${senderId}` : (user.pushName ? user.pushName : ctx.getId(user.jid));
                resultText += `❖ ${displayUser} - Menang: ${user.winGame}, Level: ${user.level}, Peringkat: ${i + 1}\n`;
            });

            if (userRank > 10) {
                const userStats = leaderboardData[userRank - 1];
                const displayUser = `@${senderId}`;
                resultText += `❖ ${displayUser} - Menang: ${userStats.winGame}, Level: ${userStats.level}, Peringkat: ${userRank}\n`;
            }

            await ctx.reply({
                text: resultText.trim(),
                mentions: [senderLid]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};