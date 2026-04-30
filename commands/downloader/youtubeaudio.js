const axios = require("axios");

module.exports = {
    name: "youtubeaudio",
    aliases: ["yta", "ytaudio", "ytmp3"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const flag = ctx.flag({
            document: {
                type: "boolean",
                short: "d",
                default: false
            }
        });
        const url = flag.input;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d")}\n` +
                tools.msg.generatesFlagInfo({
                    "-d": "Kirim sebagai dokumen"
                })
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const apiUrl = tools.api.createUrl("cuki", "/api/downloader/ytmp3", {
                url: searchResult.url
            }, "apikey");
            const result = (await axios.get(apiUrl)).data.data.audio.download.downloadUrl;

            const document = flag.document;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.download
                    },
                    fileName: result.filename,
                    mimetype: "audio/mpeg",
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                await ctx.reply({
                    audio: {
                        url: result.download
                    },
                    mimetype: "audio/mpeg"
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};