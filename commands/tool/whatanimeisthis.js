const axios = require("axios");

module.exports = {
    name: "whatanimeisthis",
    aliases: ["wait", "whatanime"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx?.quoted.contentType, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("https://api.trace.moe", "/search", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result[0];

            return await ctx.reply({
                video: {
                    url: result.video
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: `${formatter.quote(`Nama: ${result.filename}`)}\n` +
                    `${formatter.quote(`Episode: ${result.episode}`)}\n` +
                    `${formatter.quote(`Rentang Waktu: ${tools.msg.convertSecondToTimecode(result.from)}-${tools.msg.convertSecondToTimecode(result.to)}`)}\n` +
                    formatter.quote(`Kemiripan: ${result.similarity}`),
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};