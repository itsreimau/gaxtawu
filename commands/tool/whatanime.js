const { Gktw } = require("@itsreimau/gktw");
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

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Gktw.uploadFile(buffer)).data.url;
            const apiUrl = tools.api.createUrl("deline", "/tools/whatanime", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(
                `➛ ${formatter.bold("Judul")}: ${result.title}\n` +
                `➛ ${formatter.bold("Genre")}: ${result.genres[0]}\n` +
                `➛ ${formatter.bold("Sinopsis")}: ${await tools.cmd.translate(result.synopsis, "id")}\n` +
                `➛ ${formatter.bold("Karakter")}: ${result.character}\n` +
                `➛ ${formatter.bold("Deskripsi Karakter")}: ${await tools.cmd.translate(result.description, "id")}\n` +
                `➛ ${formatter.bold("Referensi")}: ${result.references[0]}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};