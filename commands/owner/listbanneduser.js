const { Baileys } = require("@itsreimau/gktw");

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
                if (user.banned === true) {
                    bannedUsers.push(user.jid);
                }
            }

            let resultText = "";
            let userMentions = [];

            for (const userJid of bannedUsers) {
                const userId = ctx.getId(userJid);
                resultText += `${formatter.quote(`@${userId}`)}\n`;
                userMentions.push(userJid);
            }

            await ctx.reply({
                text: resultText.trim() || config.msg.notFound,
                mentions: userMentions,
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};