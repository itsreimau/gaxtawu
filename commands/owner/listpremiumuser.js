const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "listpremiumuser",
    aliases: ["listprem", "listpremium"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = await db.get("user");
            const premiumUsers = [];

            for (const userId in users) {
                if (users[userId].premium === true) {
                    premiumUsers.push({
                        id: userId,
                        expiration: users[userId].premiumExpiration
                    });
                }
            }

            let resultText = "";
            let userMentions = [];

            for (const user of premiumUsers) {
                userMentions.push(user.id + Baileys.S_WHATSAPP_NET);

                if (user.expiration) {
                    const daysLeft = tools.msg.convertMsToDuration(Date.now() - user.expiration, ["hari"]);
                    resultText += `${formatter.quote(`@${user.id} (${daysLeft} tersisa)`)}\n`;
                } else {
                    resultText += `${formatter.quote(`@${user.id} (Premium permanen)`)}\n`;
                }
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