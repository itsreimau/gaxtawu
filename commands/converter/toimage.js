const axios = require("axios");

module.exports = {
    name: "toimage",
    aliases: ["toimg", "topng"],
    category: "converter",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        if (!tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["sticker"])) return await ctx.reply(tools.msg.generateInstruction(["reply"], ["sticker"]));

        try {
            const buffer = await ctx.quoted.download();
            const apiUrl = tools.api.createUrl("https://nekochii-converter.hf.space", "/webp2png");
            const result = (await axios.post(apiUrl, {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};