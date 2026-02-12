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

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.mediafire.com/file/on2jvy5540bi22u/humanity-turned-into-lcl-scene.mp4/file")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("bagus", "/api/download/mediafire", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const fileType = result.fileType.split("(")[1].split(")")[0].toLowerCase();

            await ctx.reply({
                document: {
                    url: result.download
                },
                fileName: `${result.fileName}.${fileType}`,
                mimetype: tools.mime.lookup(fileType),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};