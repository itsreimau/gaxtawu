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

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://drive.google.com/file/d/1LunbMSJNMtGnUpy9fJGx7bougiwAo23j/view?usp=drive_link")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("bagus", "/api/download/gdrive", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                document: {
                    url: result.download
                },
                fileName: result.name,
                mimetype: tools.mime.lookup(result.name),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};