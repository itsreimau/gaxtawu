module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["video"]));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const result = (await axios.post("https://nekochii-converter.hf.space/mp4tomp3", {
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};