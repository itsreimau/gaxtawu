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
                const userId = ctx.getId(mutedUser);
                userMentions.push(mutedUser);

                resultText += `➛ @${userId}\n`;
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