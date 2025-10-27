const axios = require("axios");

module.exports = {
    name: "play",
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const flag = tools.cmd.parseFlag(ctx.args.join(" ") || null, {
            "-i": {
                type: "value",
                key: "index",
                validator: (val) => !isNaN(val) && parseInt(val) > 0,
                parser: (val) => parseInt(val) - 1
            },
            "-s": {
                type: "value",
                key: "source",
                validator: (val) => true,
                parser: (val) => val.toLowerCase()
            }
        });
        const input = flag.input;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify")}\n` +
            tools.msg.generatesFlagInfo({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: spotify, youtube | default: youtube)"
            })
        );

        try {
            const searchIndex = flag?.index || 0;
            let source = flag?.source || null;

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("yp", "/api/search/spotify", {
                    q: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.artist}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = tools.api.createUrl("izumi", "/downloader/spotify", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.download;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            } else {
                const searchApiUrl = tools.api.createUrl("yp", "/api/search/youtube", {
                    q: input
                });
                const searchResult = ((await axios.get(searchApiUrl)).data.results.filter(res => res.videoId))[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.channel}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.url}`
                );

                const downloadApiUrl = tools.api.createUrl("yp", "/api/downloader/ytmp3", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.link;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};