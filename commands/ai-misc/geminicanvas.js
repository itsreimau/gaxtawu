const {
    Baileys
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "geminicanvas",
    aliases: ["gcanvas"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "make it evangelion art style"))
        );

        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await Baileys.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("neko", "/ai/gemini-canvas", {
                text: input,
                imageUrl: uploadUrl
            });
            const result = Buffer.from((await axios.get(apiUrl)).data.result.image.base64, "base64");

            await ctx.reply({
                image: result,
                mimetype: tools.mime.lookup("jpeg"),
                caption: formatter.quote("Untukmu, tuan!"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};