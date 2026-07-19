module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tt", "ttdl", "vt", "vtdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || ctx.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@netflixanime/video/7596931111805078805")
            );

        if (!ctx.helper.isUrl(url)) return await ctx.reply(ctx.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = ctx.api.createUrl("delirius", "/download/tiktok", {
                url
            });
            const result = (await ctx.request.get(apiUrl)).data.data.meta.media[0];

            if (result.type === "video") {
                await ctx.reply({
                    video: {
                        url: result.org
                    },
                    caption: `❖ ${ctx.msg.bold("URL")}: ${url}`
                });
            } else {
                const album = result.images.map(res => ({
                    image: {
                        url: res
                    }
                }));

                await ctx.reply({
                    album,
                    caption: `❖ ${ctx.msg.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};