const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "whatanime",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Baileys.uploadFile(buffer)).data.url;
            const apiUrl = tools.api.createUrl("deline", "/tools/whatanime", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                text: `${formatter.quote(`Judul: ${result.title}`)}\n` +
                    `${formatter.quote(`Genre: ${result.genres[0]}`)}\n` +
                    `${formatter.quote(`Sinopsis: ${await tools.cmd.translate(result.synopsis, "id")}`)}\n` +
                    `${formatter.quote(`Karakter: ${result.character}`)}\n` +
                    `${formatter.quote(`Deskripsi Karakter: ${await tools.cmd.translate(result.description, "id")}`)}\n` +
                    formatter.quote(`Referensi: ${result.references[0]}`)
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};