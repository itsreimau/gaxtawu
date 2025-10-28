const { Gktw } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "removebackground",
    aliases: ["removebg"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = (await Gktw.uploadFile(buffer, "image")).data.url;
            const apiUrl = tools.api.createUrl("deline", "/tools/removebg", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.cutoutUrl;

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