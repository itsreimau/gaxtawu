const axios = require("axios");

module.exports = {
    name: "googledrivedl",
    aliases: ["gd", "gddl", "googledrive"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://drive.google.com/file/d/1-jkLy92U-uwB36GzGJj04fjRFRz0ZzO3/view")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("deline", "/downloader/gdrive", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                document: {
                    url: result.downloadUrl
                },
                fileName: result.fileName,
                mimetype: result.mimetype,
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};