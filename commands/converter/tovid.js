const axios = require("axios");

module.exports = {
    name: "tovideo",
    aliases: ["tomp4", "tovid"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx?.quoted.contentType, ["sticker"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer();
            const apiUrl = tools.api.createUrl("https://nekochii-converter.hf.space", "/webp2mp4");
            const result = (await axios.post(apiUrl, {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};