module.exports = {
    name: "spotifydl",
    aliases: ["spotidl"],
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
        const url = flag.input || tools.helper.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "https://open.spotify.com/track/5RhWszHMSKzb7KiXk4Ae0M")}\n` +
                tools.msg.generatesFlagInfo({
                    "-d": "Kirim sebagai dokumen"
                })
            );

        if (!tools.helper.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("delirius", "/download/spotifydl", {
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
                    caption: `❖ ${tools.msg.bold("URL")}: ${url}`
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
            await tools.helper.handleError(ctx, error, true);
        }
    }
};