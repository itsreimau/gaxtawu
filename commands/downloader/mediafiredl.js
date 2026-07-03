module.exports = {
    name: "mediafiredl",
    aliases: ["mediafire", "mf", "mfdl"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.mediafire.com/file/on2jvy5540bi22u/humanity-turned-into-lcl-scene.mp4/file")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("nexray", "/downloader/mediafire", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                document: {
                    url: result.download_url
                },
                fileName: result.filename,
                mimetype: result.mimetype,
                caption: `❖ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};