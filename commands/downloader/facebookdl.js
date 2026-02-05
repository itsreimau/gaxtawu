const axios = require("axios");

module.exports = {
    name: "facebookdl",
    aliases: ["facebook", "fb", "fbdl"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.facebook.com/reel/1112151989983701")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("bagus", "/api/download/facebook", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                video: {
                    url: result.find(res => res.quality.includes("HD")).url || result.find(res => res.quality.includes("SD")).url
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};