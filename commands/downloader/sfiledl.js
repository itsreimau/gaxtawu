const axios = require("axios");

module.exports = {
    name: "sfiledl",
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://sfile.mobi/a1NTccB8T6m"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("zell", "/download/sfile", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                document: {
                    url: result.download_url
                },
                fileName: result.metadata.filename,
                mimetype: result.metadata.mimetype || "application/octet-stream",
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};