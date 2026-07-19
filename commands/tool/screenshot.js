module.exports = {
    name: "screenshot",
    aliases: ["ss", "sshp", "sspc", "sstab", "ssweb"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                ctx.text.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.text.info(config.msg.invalidUrl));

        try {
            const result = ctx.api.createUrl("alwayscodex", "/api/tools/ssweb", {
                url,
                device: ctx.used === "sshp" ? "mobile" : ctx.used === "sstab" ? "tablet" : "desktop"
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${ctx.text.bold("URL")}: ${url}`
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};