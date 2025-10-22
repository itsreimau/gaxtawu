module.exports = {
    name: "listapis",
    aliases: ["listapi"],
    category: "information",
    code: async (ctx) => {
        try {
            const APIs = tools.api.listUrl();
            let resultText = "";

            for (const [name, api] of Object.entries(APIs)) resultText += `➛ ${api.baseURL}\n`;

            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};