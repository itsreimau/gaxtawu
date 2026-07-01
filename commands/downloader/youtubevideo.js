module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
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
            },
            resolution: {
                type: "string",
                short: "r",
                default: "360"
            }
        });
        const url = flag.input || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d -r 720")}\n` +
                tools.msg.generatesFlagInfo({
                    "-d": "Kirim sebagai dokumen",
                    "-r": "Resolusi video (tersedia: 144, 240, 360, 480, 720, 1080, 1440, 2160 | default: 360)"
                })
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/downloader/youtube2", {
                url,
                quality: ["360", "480", "720", "1080", "1440", "2160"].includes(flag.resolution) ? `${flag.resolution}p` : "720p"
            });
            const result = (await axios.get(apiUrl)).data.result;

            const document = flag.document;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.downloadUrl
                    },
                    fileName: `${result.title}.mp4`,
                    mimetype: "video/mp4",
                    caption: `❖ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                await ctx.reply({
                    video: {
                        url: result.downloadUrl
                    },
                    caption: `❖ ${formatter.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};