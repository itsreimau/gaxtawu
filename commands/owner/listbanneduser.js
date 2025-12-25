module.exports = {
    name: "listbanneduser",
    aliases: ["listban", "listbanned"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getMany(user => user.banned === true);
            const bannedUsers = [];

            for (const user of users) {
                if (user.banned === true) bannedUsers.push(user.jid);
            }

            let resultText = "";
            let userMentions = [];

            for (const bannedUser of bannedUsers) {
                const userId = ctx.getId(bannedUser);
                resultText += `➛ @${userId}\n`;
                userMentions.push(bannedUser);
            }

            await ctx.reply({
                text: resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`,
                mentions: userMentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};