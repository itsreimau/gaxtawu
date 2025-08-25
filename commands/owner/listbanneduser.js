const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "listbanneduser",
    aliases: ["listban", "listbanned"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = await db.get("user");
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].banned === true) bannedUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            bannedUsers.forEach(userId => {
                resultText += `${formatter.quote(`@${userId}`)}\n`;
            });

            bannedUsers.forEach(userId => {
                userMentions.push(userId + Baileys.S_WHATSAPP_NET);
            });

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