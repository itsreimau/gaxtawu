const axios = require("axios");

module.exports = {
    name: "whatmusic",
    aliases: ["shazam"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "audio"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "audio")
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], "audio"));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("deline", "/tools/whatmusic", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(
                `➛ ${formatter.bold("Judul")}: ${result.title}\n` +
                `➛ ${formatter.bold("Artis")}: ${result.artists}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};