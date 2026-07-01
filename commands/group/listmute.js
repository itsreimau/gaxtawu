module.exports = {
    name: "listmute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            let resultText = "";
            let userMentions = [];

            for (const mutedUser of muteList) {
                const userId = ctx.getId(mutedUser.jid);
                userMentions.push(mutedUser.jid);

                if (mutedUser.expiration) {
                    const timeDiff = mutedUser.expiration - Date.now();
                    const daysLeft = tools.msg.convertMsToDuration(timeDiff, ["hari", "jam"]);
                    resultText += `❖ @${userId} (${daysLeft} tersisa)\n`;
                } else {
                    resultText += `❖ @${userId} (Permanen)\n`;
                }

                resultText += `❖ @${userId}\n`;
            }

            await ctx.reply({
                text: resultText.trim() || tools.msg.info(config.msg.notFound),
                mentions: userMentions
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};