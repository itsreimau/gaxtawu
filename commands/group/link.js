module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const code = await ctx.group().inviteCode();

            await ctx.reply(`https://chat.whatsapp.com/${code}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};