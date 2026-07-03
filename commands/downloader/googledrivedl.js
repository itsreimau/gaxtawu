module.exports = {
    name: "googledrivedl",
    aliases: ["gd", "gddl", "googledrive"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://drive.google.com/file/d/1-jkLy92U-uwB36GzGJj04fjRFRz0ZzO3/view")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("lexcode", "/api/dwn/gdrive", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                document: {
                    url: result.downloadUrl
                },
                fileName: result.fileName,
                mimetype: result.mimeType,
                caption: `❖ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};