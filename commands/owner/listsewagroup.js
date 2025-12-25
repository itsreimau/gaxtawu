module.exports = {
    name: "listsewagroup",
    aliases: ["listsewa"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const groups = ctx.db.groups.getMany(group => group.sewa === true);
            const sewaGroups = [];

            for (const group of groups) {
                if (group.sewa === true)
                    sewaGroups.push({
                        jid: group.jid,
                        expiration: group.sewaExpiration
                    });
            }

            let resultText = "";
            let groupMentions = [];

            for (const group of sewaGroups) {
                const groupJid = group.jid;
                const groupSubject = await ctx.group(groupJid).name();

                groupMentions.push({
                    groupJid,
                    groupSubject
                });

                if (group.expiration) {
                    const timeDiff = group.expiration - Date.now();
                    const daysLeft = tools.msg.convertMsToDuration(timeDiff, ["hari"]);
                    resultText += `➛ @${groupJid} (${daysLeft} tersisa)\n`;
                } else {
                    resultText += `➛ @${groupJid} (Sewa permanen)\n`;
                }
            }

            await ctx.reply({
                text: resultText.trim() || `ⓘ ${formatter.italic(config.msg.notFound)}`,
                contextInfo: {
                    groupMentions
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};