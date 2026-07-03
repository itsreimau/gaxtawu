module.exports = {
    name: "twitterdl",
    aliases: ["twitter", "twit", "twitdl", "x", "xdl"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://x.com/evangelion_co/status/1371234691504861186")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("delirius", "/download/twitterdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data;

            if (result.type === "video") {
                await ctx.reply({
                    video: {
                        url: result.media[0].url
                    },
                    caption: `❖ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                const album = result.media.map(res => ({
                    image: {
                        url: res.url
                    }
                }));

                await ctx.reply({
                    album,
                    caption: `❖ ${formatter.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};