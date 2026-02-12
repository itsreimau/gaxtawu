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

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://cosplaytele.com/rei-ayanami")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("zell", "/download/cosplaytele", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.gallery_images;
            const album = result.map((imageUrl, index) => ({
                image: {
                    url: imageUrl
                },
                mimetype: tools.mime.lookup("png"),
                caption: index === 0 ? `➛ ${formatter.bold("URL")}: ${url}` : null
            }));

            await ctx.reply({
                album
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};