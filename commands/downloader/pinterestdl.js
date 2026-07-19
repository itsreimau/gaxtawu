module.exports = {
    name: "pinterestdl",
    aliases: ["pindl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "https://id.pinterest.com/pin/843580573994363210")
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = ctx.api.createUrl("delirius", "/download/pinterestdl", {
                url
            });
            const result = (await ctx.request.get(apiUrl)).data.data.download;

            await ctx.reply({
                [result.type]: {
                    url: result.url
                },
                caption: `❖ ${ctx.msg.bold("URL")}: ${url}`
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};