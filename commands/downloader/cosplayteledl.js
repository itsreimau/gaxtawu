const axios = require("axios");

module.exports = {
    name: "cosplayteledl",
    aliases: ["cosplaytele"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://cosplaytele.com/rei-ayanami"))
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("zell", "/download/cosplaytele", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.gallery_images;
            const album = result.map(imageUrl => ({
                image: {
                    url: imageUrl
                },
                mimetype: tools.mime.lookup("png")
            }));

            await ctx.reply({
                album,
                caption: formatter.quote(`URL: ${url}`)
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};