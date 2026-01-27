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
            "-d": {
                type: "boolean",
                key: "document"
            }
        });
        const url = flag.input || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=0Uhh62MUEic -d")}\n` +
                tools.msg.generatesFlagInfo({
                    "-d": "Kirim sebagai dokumen"
                })
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("deline", "/downloader/ytmp3", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            const document = flag?.document || false;
            if (document) {
                await ctx.reply({
                    document: {
                        url: result.dlink
                    },
                    fileName: `${result.youtube.title}.mp3`,
                    mimetype: tools.mime.lookup("mp3"),
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                await ctx.reply({
                    audio: {
                        url: result.dlink
                    },
                    mimetype: tools.mime.lookup("mp3")
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};