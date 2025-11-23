const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || ctx.quoted?.text || null;
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "en";

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "en halo, dunia!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        try {
            const apiUrl = api.createUrl("deline", "/tools/translate", {
                text: input,
                target: langCode
            });
            const result = (await axios.get(apiUrl)).data.data.hasil_terjemahan;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};