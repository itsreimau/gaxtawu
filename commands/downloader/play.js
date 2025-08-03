const axios = require("axios");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: soundcloud, spotify, youtube | default: youtube)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
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

            const searchIndex = flag?.index || 0;
            const query = flag?.input;
            let source = flag?.source || "youtube";
            if (!["soundcloud", "spotify", "youtube"].includes(source)) source = "youtube";

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/soundcloud", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.title}`)}\n` +
                        formatter.quote(`URL: ${searchResult.url}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("hang", "/download/soundcloud", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result;

                return await ctx.reply({
                    audio: {
                        url: downloadResult.audioBase || downloadResult.download
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            }

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/spotify", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.trackName}`)}\n` +
                        `${formatter.quote(`Artis: ${searchResult.artistName}`)}\n` +
                        formatter.quote(`URL: ${searchResult.externalUrl}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("archive", "/api/download/spotify", {
                    url: searchResult.externalUrl
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.data.download;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            }

            if (source === "youtube") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/youtube", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply({
                    text: `${formatter.quote(`Judul: ${searchResult.title}`)}\n` +
                        `${formatter.quote(`Artis: ${searchResult.channel}`)}\n` +
                        formatter.quote(`URL: ${searchResult.link}`),
                    footer: config.msg.footer
                });

                const downloadApiUrl = tools.api.createUrl("nekorinn", "/downloader/youtube", {
                    url: searchResult.link,
                    format: 320,
                    type: "audio"
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.downloadUrl;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};