const axios = require("axios");

module.exports = {
    name: "mediafiredl",
    aliases: ["mediafire", "mf", "mfdl"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.mediafire.com/file/on2jvy5540bi22u/humanity-turned-into-lcl-scene.mp4/file"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("neko", "/downloader/mediafire", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                document: {
                    url: result.download.url
                },
                fileName: data.fileName,
                mimetype: data.mimetype || "application/octet-stream",
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};