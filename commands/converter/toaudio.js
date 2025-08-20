const axios = require("axios");

module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, ["video"]),
            tools.cmd.checkQuotedMedia(ctx?.quoted.contentType, ["video"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["video"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const apiUrl = tools.api.createUrl("https://nekochii-converter.hf.space", "/mp4tomp3");
            const result = (await axios.post(apiUrl, {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp3")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};