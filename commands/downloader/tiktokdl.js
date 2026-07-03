module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tt", "ttdl", "vt", "vtdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@netflixanime/video/7596931111805078805")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("delirius", "/download/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.meta.media[0];

            if (result.type === "video") {
                await ctx.reply({
                    video: {
                        url: result.org
                    },
                    caption: `❖ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                const album = result.images.map(res => ({
                    image: {
                        url: res
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