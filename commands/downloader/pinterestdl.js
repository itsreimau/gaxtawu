const axios = require("axios");

module.exports = {
    name: "pinterestdl",
    aliases: ["pindl"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://id.pinterest.com/pin/843580573994363210")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("chocomilk", "/v1/download/pinterest", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                [result.is_video ? "video" : "image"]: {
                    url: result.is_video ? result.media.videos[0].url : result.media.images?.original?.url
                },
                mimetype: result.is_video ? tools.mime.lookup("mp4") : tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};