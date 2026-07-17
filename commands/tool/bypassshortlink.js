module.exports = {
    name: "bypassshortlink",
    aliases: ["bypasslink"],
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        if (!tools.helper.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/solve/bypasslink", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.bypassedUrl;

            await ctx.reply(result);
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};