module.exports = {
    name: "listpremiumuser",
    aliases: ["listprem", "listpremium"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = await ctx.db.users.getMany(user => user.premium === true);
            const premiumUsers = [];

            for (const user of users) {
                if (user.premium === true) {
                    premiumUsers.push({
                        jid: user.jid,
                        expiration: user.premiumExpiration
                    });
                }
            }

            let resultText = "";
            let userMentions = [];

            for (const user of premiumUsers) {
                const userJid = user.jid;
                const userId = ctx.getID(user.jid);
                userMentions.push(userJid);

                if (user.expiration) {
                    const timeDiff = user.expiration - Date.now();
                    const daysLeft = tools.msg.convertMsToDuration(timeDiff, ["hari"]);
                    resultText += `${formatter.quote(`@${userId} (${daysLeft} tersisa)`)}\n`;
                } else {
                    resultText += `${formatter.quote(`@${userId} (Premium permanen)`)}\n`;
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