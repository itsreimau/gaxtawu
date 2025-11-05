const axios = require("axios");

module.exports = {
    name: "tovideo",
    aliases: ["tomp4", "tovid"],
    category: "converter",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["sticker"])) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["sticker"]));

        try {
            const buffer = await ctx.quoted.download();
            const apiUrl = tools.api.createUrl("https://nekochii-converter.hf.space", "/webp2mp4");
            const result = (await axios.post(apiUrl, {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};