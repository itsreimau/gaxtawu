module.exports = {
    name: "play",
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const flag = ctx.flag({
            index: {
                type: "string",
                short: "i",
                default: "0"
            },
            source: {
                type: "string",
                short: "s",
                default: "youtube"
            }
        });
        const input = flag.input;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify")}\n` +
                ctx.msg.generatesFlagInfo({
                    "-i <number>": "Pilihan pada data indeks",
                    "-s <text>": "Sumber untuk memutar lagu (tersedia: spotify, youtube | default: youtube)"
                })
            );

        try {
            const searchIndex = parseInt(flag.index, 10);
            const source = flag.source;

            if (source === "spotify") {
                const searchApiUrl = ctx.api.createUrl("delirius", "/search/spotify", {
                    q: input
                });
                const searchResult = (await ctx.request.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `❖ ${ctx.msg.bold("Judul")}: ${searchResult.title}\n` +
                    `❖ ${ctx.msg.bold("Artis")}: ${searchResult.artist}\n` +
                    `❖ ${ctx.msg.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = ctx.api.createUrl("delirius", "/download/spotifydl", {
                    url: searchResult.url
                });
                const downloadResult = (await ctx.request.get(downloadApiUrl)).data.data.download;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: "audio/mpeg"
                });
            } else {
                const searchApiUrl = ctx.api.createUrl("delirius", "/search/ytsearch", {
                    q: input
                });
                const searchResult = (await ctx.request.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `❖ ${ctx.msg.bold("Judul")}: ${searchResult.title}\n` +
                    `❖ ${ctx.msg.bold("Artis")}: ${searchResult.author.name}\n` +
                    `❖ ${ctx.msg.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = ctx.api.createUrl("delirius", "/download/ytmp3", {
                    url: searchResult.url
                });
                const downloadResult = (await ctx.request.get(downloadApiUrl)).data.data.download;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: "audio/mpeg"
                });
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};