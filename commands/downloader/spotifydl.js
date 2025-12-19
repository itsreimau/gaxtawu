const axios = require("axios");

module.exports = {
    name: "spotifydl",
    aliases: ["spotidl"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://open.spotify.com/track/5RhWszHMSKzb7KiXk4Ae0M")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("deline", "/downloader/spotify", {
                url
            });
            const result = (await axios.get(apiUrl)).data.download;

            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp3")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};