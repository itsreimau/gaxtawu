class TopHandler {
    constructor(option) {
        this.name = option.name;
        this.aliases = option.aliases;
        this.sortDirection = option.sortDirection;
        this.permissions = {
            group: true
        };
    }

    async handle(ctx) {
        try {
            let members = ctx.db.group?.members || [];
            members = members.filter(member => !tools.helper.areJidsSameUser(member.id, ctx.me.lid));

            if (this.sortDirection === "asc") {
                members = members.sort((a, b) => a.sent - b.sent);
            } else {
                members = members.sort((a, b) => b.sent - a.sent);
            }

            const topMembers = members.slice(0, 10);
            let text = "";
            const mentions = [];

            topMembers.forEach((member, id) => {
                const isSelf = tools.helper.areJidsSameUser(member.id, ctx.sender.lid);
                let displayName = member.pushName || ctx.getId(member.id);

                if (isSelf) {
                    const mentionId = ctx.getId(member.id);
                    displayName = `@${mentionId}`;
                    mentions.push(member.id);
                }

                if (id === 0) {
                    text += `❖ ${displayName} - ${member.sent} pesan\n`;
                } else if (id === 1) {
                    text += `❖ ${displayName} - ${member.sent} pesan\n`;
                } else if (id === 2) {
                    text += `❖ ${displayName} - ${member.sent} pesan\n`;
                } else {
                    text += `❖ ${id + 1}. ${displayName} - ${member.sent} pesan\n`;
                }
            });

            await ctx.reply({
                text: text.trim(),
                mentions: mentions
            });
        } catch (err) {
            await tools.helper.handleError(ctx, err);
        }
    }
}

const options = {
    topsider: {
        name: "topsider",
        aliases: ["sider"],
        sortDirection: "asc"
    },
    topyapping: {
        name: "topyapping",
        aliases: ["yapping"],
        sortDirection: "desc"
    }
};

module.exports = Object.entries(options).map(([name, option]) => {
    const handler = new TopHandler(option);

    return {
        name: handler.name,
        aliases: handler.aliases,
        category: "group",
        permissions: handler.permissions,
        code: async (ctx) => await handler.handle(ctx)
    };
});