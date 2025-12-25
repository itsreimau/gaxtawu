const axios = require("axios");

module.exports = {
    name: "fluxkontext",
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "image"));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            let result;
            for (let v = 1; v <= 2; v++) {
                const apiUrl = tools.api.createUrl("nekolabs", `/img.gen/flux/kontext/v${v}`, {
                    prompt: input,
                    imageUrl: uploadUrl
                });
                try {
                    result = (await axios.get(apiUrl)).data.result;
                    break;
                } catch (error) {
                    if (v === 2) throw error;
                }
            }

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