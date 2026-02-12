const axios = require("axios");

module.exports = {
    name: "play",
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const flag = ctx.flag({
            "-i": {
                type: "value",
                key: "index",
                validator: val => !isNaN(val) && parseInt(val) > 0,
                parser: val => parseInt(val) - 1
            },
            "-s": {
                type: "value",
                key: "source",
                validator: val => true,
                parser: val => val.toLowerCase()
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
            const searchIndex = flag?.index || 0;
            const source = flag?.source || null;

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("bagus", "/api/search/spotify", {
                    q: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.artist}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.track_url}`
                );

                const downloadApiUrl = tools.api.createUrl("bagus", "/api/download/spotify", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.download;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            } else {
                const searchApiUrl = tools.api.createUrl("bagus", "/api/search/yts", {
                    q: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
                    `➛ ${formatter.bold("Artis")}: ${searchResult.channel}\n` +
                    `➛ ${formatter.bold("URL")}: ${searchResult.link}`
                );

                const downloadApiUrl = tools.api.createUrl("danzy", "/api/download/ytmp3", {
                    url: searchResult.link
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.data.downloadUrl;

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