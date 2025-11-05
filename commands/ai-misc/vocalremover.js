const axios = require("axios");

module.exports = {
    name: "vocalremover",
    aliases: ["instrumental"],
    category: "ai-misc",
    permissions: {
        premium: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "audio"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "audio")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "audio"));

        try {
            const buffer = await ctx.msg.download() || await ctx.quoted.download();
            const uploadUrl = await ctx.core.rexx.utils.uploadFile(buffer);
            const apiUrl = tools.api.createUrl("zell", "/tools/vocalremover", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.instrumental_path;

            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp3")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};