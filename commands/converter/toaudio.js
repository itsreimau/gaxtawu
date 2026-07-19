module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const isMedia = ctx.isMedia(["video"]);

        if (!isMedia) return await ctx.reply(ctx.text.generateInstruction(["send", "reply"], ["video"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const result = (await ctx.request.post("https://nekochii-converter.hf.space/mp4tomp3", {
                file: buffer.toString("base64"),
                json: true
            })).data.result;

            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: "audio/mpeg"
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};