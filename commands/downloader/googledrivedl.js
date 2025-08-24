const axios = require("axios");

module.exports = {
    name: "googledrivedl",
    aliases: ["gd", "gddl", "googledrive"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://drive.google.com/file/d/1LunbMSJNMtGnUpy9fJGx7bougiwAo23j/view?usp=drive_link"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("davidcyril", "/gdrive", {
                url
            });
            const result = (await axios.get(apiUrl)).data;

            await ctx.reply({
                document: result.download_link,
                fileName: result.name,
                mimetype: tools.mime.lookup(result.name) || "application/octet-stream",
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};