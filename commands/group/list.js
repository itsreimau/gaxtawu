module.exports = [{
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
                    const daysLeft = ctx.text.convertMsToDuration(timeDiff, ["hari", "jam"]);
                    resultText += `❖ @${userId} (${daysLeft} tersisa)\n`;
                } else {
                    resultText += `❖ @${userId} (Permanen)\n`;
                }

                resultText += `❖ @${userId}\n`;
            }

            await ctx.reply({
                text: resultText.trim() || ctx.text.info(config.msg.notFound),
                mentions: userMentions
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "listpendingmembers",
    aliases: ["pendingmembers"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const pendings = await ctx.group().pendingMembers();
            const resultText = pendings.map(pending => `❖ ${ctx.getId(pending.id)}`).join("\n");

            await ctx.reply(resultText.trim() || ctx.text.info(config.msg.notFound));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
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

                resultText += `❖ @${userId} (${warning.count}/${groupDb?.maxwarnings || 3})\n`;
            }

            await ctx.reply({
                text: resultText.trim() || ctx.text.info(config.msg.notFound),
                mentions: userMentions
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];