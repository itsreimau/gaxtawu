module.exports = {
    name: "screenshot",
    aliases: ["ss", "sshp", "sspc", "sstab", "ssweb"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const result = tools.api.createUrl("alwayscodex", "/api/tools/ssweb", {
                url,
                device: ctx.used === "sshp" ? "mobile" : ctx.used === "sstab" ? "tablet" : "desktop"
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};