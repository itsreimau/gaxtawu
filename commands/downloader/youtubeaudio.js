module.exports = {
    name: "youtubeaudio",
    aliases: ["yta", "ytaudio", "ytmp3"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const flag = ctx.flag({
            document: {
                type: "boolean",
                short: "d",
                default: false
            }
        });
        const url = flag.input || tools.cmd.extractUrlFromText(ctx.quoted?.body);

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
            const apiUrl = tools.api.createUrl("delirius", "/download/ytmp3", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            const document = flag.document;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.download
                    },
                    fileName: `${result.title}.mp3`,
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