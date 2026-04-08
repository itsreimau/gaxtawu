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
            const profilePictureUrl = await ctx.core.profilePictureUrl(participantJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const canvasUrl = tools.api.createUrl("siputzx", "/api/canvas/profile", {
                backgroundURL: "https://picsum.photos/850/300",
                avatarURL: profilePictureUrl,
                rankName: "RANK",
                rankId: leaderboardData.findIndex(user => tools.cmd.areJidsSameUser(user.jid, ctx.sender.lid)) + 1,
                exp: userDb?.xp || 0,
                requireExp: "100",
                level: userDb?.level || 0,
                name: ctx.sender.pushName
            });

            await ctx.reply({
                image: {
                    url: canvasUrl
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Nama")}: ${ctx.sender.pushName} (${userDb?.username})\n` +
                    `➛ ${formatter.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["hari", "jam"])} tersisa` : "Selamanya"})` : "Freemium")}\n` +
                    `➛ ${formatter.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                    `➛ ${formatter.bold("Koin")}: ${ctx.sender.isOwner() || userDb?.premium ? "Tak terbatas" : userDb?.coin}\n` +
                    `➛ ${formatter.bold("Menang")}: ${userDb?.winGame || 0}\n` +
                    `➛ ${formatter.bold("Peringkat")}: ${leaderboardData.findIndex(user => tools.cmd.areJidsSameUser(user.jid, ctx.sender.lid)) + 1}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};