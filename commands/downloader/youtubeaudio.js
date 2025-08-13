const axios = require("axios");

module.exports = {
    name: "youtubeaudio",
    aliases: ["yta", "ytaudio", "ytmp3"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-d": "Kirim sebagai dokumen"
            }))
        );

        const flag = tools.cmd.parseFlag(input, {
            "-d": {
                type: "boolean",
                key: "document"
            }
        });

        const url = flag?.input || null;

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/youtube", {
                url,
                format: "mp3"
            });
            const result = (await axios.get(apiUrl)).data.result;

            const document = flag?.document || false;
            if (document) return await ctx.reply({
                document: {
                    url: result.download
                },
                fileName: `${result.title}.mp3`,
                mimetype: tools.mime.lookup("mp3"),
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });

            return await ctx.reply({
                audio: {
                    url: result.download
                },
                mimetype: tools.mime.lookup("mp3")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};