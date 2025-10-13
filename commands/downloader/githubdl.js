const axios = require("axios");

module.exports = {
    name: "githubdl",
    aliases: ["ghdl", "gitclone"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://github.com/itsreimau/gaxtawu"))
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("bagus", "/api/download/github", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                document: {
                    url: result.download_url
                },
                fileName: `${result.owner}-${result.repo}.zip`,
                mimetype: tools.mime.lookup("zip") || "application/octet-stream",
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};