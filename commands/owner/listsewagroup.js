module.exports = {
    name: "listsewagroup",
    aliases: ["listsewa"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const groups = await db.get("group");
            const sewaGroups = [];

            for (const groupId in groups) {
                if (groups[groupId].sewa === true) {
                    sewaGroups.push({
                        id: groupId,
                        expiration: groups[groupId].sewaExpiration
                    });
                }
            }

            let resultText = "";
            let groupMentions = [];

            for (const group of sewaGroups) {
                const groupJid = `${group.id}@g.us`;
                const groupSubject = await ctx.group(groupJid).name();

                groupMentions.push({
                    groupJid,
                    groupSubject
                });

                if (group.expiration) {
                    const daysLeft = tools.msg.convertMsToDuration(Date.now() - group.expiration, ["hari"]);
                    resultText += `${formatter.quote(`@${groupJid} (${daysLeft} tersisa)`)}\n`;
                } else {
                    resultText += `${formatter.quote(`@${groupJid} (Sewa permanen)`)}\n`;
                }
            }

            return await ctx.reply({
                text: resultText.trim() || config.msg.notFound,
                footer: config.msg.footer,
                contextInfo: {
                    groupMentions
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};