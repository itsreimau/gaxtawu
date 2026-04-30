module.exports = {
    name: "listwarning",
    aliases: ["listwarn"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];

            let resultText = "";
            let userMentions = [];

            for (const warning of warnings) {
                const userId = ctx.getId(warning.jid);
                userMentions.push(warning.jid);

                resultText += `➛ @${userId} (${warning.count}/${groupDb?.maxwarnings || 3})\n`;
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