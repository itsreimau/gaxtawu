module.exports = {
    name: "join",
    aliases: ["j"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, config.bot.groupLink)
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.msg.info(config.msg.invalidUrl));

        try {
            const urlCode = new URL(url).pathname.split("/").pop();
            await ctx.groups.acceptInvite(urlCode);

            await ctx.reply(ctx.msg.info("Berhasil bergabung dengan grup!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};