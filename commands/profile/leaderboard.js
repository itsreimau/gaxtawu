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
                resultText += `› ${displayUser} - Menang: ${user.winGame}, Level: ${user.level}, Peringkat: ${i + 1}\n`;
            });

            if (userRank > 10) {
                const userStats = leaderboardData[userRank - 1];
                const displayUser = `@${senderId}`;
                resultText += `› ${displayUser} - Menang: ${userStats.winGame}, Level: ${userStats.level}, Peringkat: ${userRank}\n`;
            }

            const usersData = await Promise.all(topUsers.map(async (user, index) => ({
                top: index + 1,
                avatar: await ctx.profilePictureUrl(user.jid),
                tag: user.pushName || ctx.getId(user.jid),
                score: user.winGame
            })));
            const canvasUrl = tools.api.createUrl("siputzx", "/api/canvas/top", {
                background: "https://picsum.photos/680/745",
                usersData: JSON.stringify(usersData),
                scoreMessage: "Level:"
            });

            await ctx.reply({
                image: {
                    url: canvasUrl
                },
                caption: resultText.trim(),
                mentions: [senderLid],
                product: {
                    title: "Leaderboard"
                },
                businessOwnerJid: ctx.sender.jid,
                nativeFlow: [{
                    text: "\u00A0",
                    id: "\u00A0",
                    icon: "review"
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};