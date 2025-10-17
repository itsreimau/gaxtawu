const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "whatmusic",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "audio"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "audio")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "audio")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Baileys.uploadFile(buffer)).data.url;
            const apiUrl = tools.api.createUrl("deline", "/tools/whatmusic", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                text: `${formatter.quote(`Judul: ${result.title}`)}\n` +
                    formatter.quote(`Artis: ${result.artists}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};