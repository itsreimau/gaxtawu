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
            const apiUrl = tools.api.createUrl("deline", "/downloader/pinterest", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const media = result.video === "Tidak ada" ? "image" : "video";

            await ctx.reply({
                [media]: {
                    url: result[media]
                },
                mimetype: media === "image" ? tools.mime.lookup("png") : tools.mime.lookup("mp4"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};