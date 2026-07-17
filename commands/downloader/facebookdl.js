module.exports = {
    name: "facebookdl",
    aliases: ["facebook", "fb", "fbdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.facebook.com/reel/2796711250580249")
            );

        if (!tools.helper.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("delirius", "/download/facebook", {
                url
            });
            const result = (await axios.get(apiUrl)).data.list[0].url;

            await ctx.reply({
                video: {
                    url: result
                },
                caption: `❖ ${tools.msg.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
};