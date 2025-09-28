const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "tosketch",
    aliases: ["jadisketch"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await Baileys.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("kyyokatsu", "/tools/img2sketch", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.result;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpeg"),
                caption: formatter.quote("Untukmu, tuan!"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};