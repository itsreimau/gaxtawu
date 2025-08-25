const axios = require("axios");

module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const flag = tools.cmd.parseFlag(ctx.args.join(" ") || null, {
            "-d": {
                type: "boolean",
                key: "document"
            },
            "-q": {
                type: "value",
                key: "quality",
                validator: (val) => !isNaN(val) && parseInt(val) > 0,
                parser: (val) => parseInt(val)
            }
        });
        const url = flag.input || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d -q 720"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-d": "Kirim sebagai dokumen",
                "-q <number>": "Pilihan pada kualitas video (tersedia: 144, 240, 360, 480, 720, 1080 | default: 720)"
            }))
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            let quality = flag?.quality || 720;
            if (![144, 240, 360, 480, 720, 1080].includes(quality)) quality = 720;
            const apiUrl = tools.api.createUrl("izumi", "/downloader/youtube", {
                url,
                format: quality
            });
            const result = (await axios.get(apiUrl)).data.result;

            const document = flag?.document || false;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.download
                    },
                    fileName: `${result.title}.mp4`,
                    mimetype: tools.mime.lookup("mp4"),
                    caption: formatter.quote(`URL: ${url}`),
                    footer: config.msg.footer
                });
            } else {
                await ctx.reply({
                    video: {
                        url: result.download
                    },
                    mimetype: tools.mime.lookup("mp4"),
                    caption: formatter.quote(`URL: ${url}`),
                    footer: config.msg.footer
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};