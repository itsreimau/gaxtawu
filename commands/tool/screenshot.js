module.exports = {
    name: "screenshot",
    aliases: ["ss", "sshp", "sspc", "ssweb"],
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

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const [width, height] = ctx.used.command === "sshp" ? [360, 800] : [1920, 1080];
            const apiUrl = tools.api.createUrl("kuroneko", "/api/tools/ssweb", {
                url,
                width,
                height,
                fullPage: true
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};