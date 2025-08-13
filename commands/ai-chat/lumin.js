const axios = require("axios");

module.exports = {
    name: "lumin",
    aliases: ["luminai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx?.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("diibot", "/api/ai/luminai", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result.result;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
}