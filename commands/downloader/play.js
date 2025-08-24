const axios = require("axios");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    permissions: {
        coin: 10
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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: soundcloud, spotify, youtube | default: youtube)"
            }))
        );

        try {
            const searchIndex = flag?.index || 0;
            let source = flag?.source || null;

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("izumi", "/search/soundcloud", {
                    query: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.title}`)}\n` +
                        formatter.quote(`URL: ${searchResult.url}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("izumi", "/downloader/soundcloud", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.url;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            } else if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("diibot", "/api/search/spotify", {
                    query: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.trackName}`)}\n` +
                        `${formatter.quote(`Artis: ${searchResult.artistName}`)}\n` +
                        formatter.quote(`URL: ${searchResult.externalUrl}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("diibot", "/api/download/spotify", {
                    url: searchResult.externalUrl
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.audio;

                await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            } else {
                const searchApiUrl = tools.api.createUrl("davidcyril", "/youtube/search", {
                    query: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.results[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.title}`)}\n` +
                        formatter.quote(`URL: ${searchResult.url}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("izumi", "/downloader/youtube", {
                    url: searchResult.url,
                    format: "mp3"
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.download;

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