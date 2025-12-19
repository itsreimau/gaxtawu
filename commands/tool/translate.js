const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "en";
        const input = ctx.text ? (ctx.text.startsWith(`${langCode} `) ? ctx.text.slice(langCode.length + 1) : ctx.text) : (ctx.quoted?.text || null);

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "en halo, dunia!")
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