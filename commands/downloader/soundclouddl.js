const axios = require("axios");

module.exports = {
    name: "soundclouddl",
    aliases: ["scdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "https://soundcloud.com/hikaruutada/one-last-kiss-live-version")
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/soundcloud", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.sound;

            await ctx.reply({
                audio: {
                    url: result.hls_url || result.progressive_url
                },
                mimetype: tools.mime.lookup("mp3")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};