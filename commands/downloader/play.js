const axios = require("axios");

module.exports = {
    name: "play",
    category: "downloader",
    permissions: {
        coin: 5
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
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify")}\n` +
                tools.msg.generatesFlagInfo({
                    "-i <number>": "Pilihan pada data indeks",
                    "-s <text>": "Sumber untuk memutar lagu (tersedia: spotify, youtube | default: youtube)"
                })
            );

        try {
            const searchIndex = parseInt(flag.index, 10);
            const source = flag.source;

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("nexray", "/search/spotify", {
                    q: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.name}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.artist}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = tools.api.createUrl("chocomilk", "/v1/download/spotify", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.data.media.url;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: "audio/mpeg"
                });
            } else {
                const searchApiUrl = tools.api.createUrl("chocomilk", "/v1/youtube/search", {
                    query: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data.all.filter(res => res.type === "video")[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.author.name}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = tools.api.createUrl("chocomilk", "/v1/youtube/download", {
                    url: searchResult.url,
                    mode: "audio"
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.data.download;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: "audio/mpeg"
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};