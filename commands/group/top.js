class TopHandler {
    constructor(config) {
        this.name = config.name;
        this.aliases = config.aliases;
        this.sortDirection = config.sortDirection;
        this.permissions = {
            group: true
        };
    }

    async handle(ctx) {
        try {
            let members = ctx.db.group?.members || [];
            members = members.filter(x => !tools.cmd.areJidsSameUser(x.id, ctx.me.lid));

            if (this.sortDirection === "asc") {
                members = members.sort((a, b) => a.sent - b.sent);
            } else {
                members = members.sort((a, b) => b.sent - a.sent);
            }

            const topMembers = members.slice(0, 10);
            const group = await ctx.group().metadata();
            let text = "";
            const mentions = [];

            topMembers.forEach((x, idx) => {
                const isSelf = tools.cmd.areJidsSameUser(x.id, ctx.sender.lid);
                let displayName = x.pushName || ctx.getId(x.id);

                if (isSelf) {
                    const mentionId = ctx.getId(x.id);
                    displayName = `@${mentionId}`;
                    mentions.push(x.id);
                }

                if (idx === 0) {
                    text += `❖ ${displayName} - ${x.sent} pesan\n`;
                } else if (idx === 1) {
                    text += `❖ ${displayName} - ${x.sent} pesan\n`;
                } else if (idx === 2) {
                    text += `❖ ${displayName} - ${x.sent} pesan\n`;
                } else {
                    text += `❖ ${idx + 1}. ${displayName} - ${x.sent} pesan\n`;
                }
            });

            await ctx.reply({
                text: text.trim(),
                mentions: mentions
            });
        } catch (err) {
            await tools.cmd.handleError(ctx, err);
        }
    }
}

const topSider = new TopHandler({
    name: "topsider",
    aliases: ["sider"],
    sortDirection: "asc"
});

const topYapping = new TopHandler({
    name: "topyapping",
    aliases: ["yapping"],
    sortDirection: "desc"
});

module.exports = [{
    name: topSider.name,
    aliases: topSider.aliases,
    category: "group",
    permissions: topSider.permissions,
    code: async (ctx) => await topSider.handle(ctx)
    }, {
    name: topYapping.name,
    aliases: topYapping.aliases,
    category: "group",
    permissions: topYapping.permissions,
    code: async (ctx) => await topYapping.handle(ctx)
    }];