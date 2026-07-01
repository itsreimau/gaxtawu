module.exports = {
    name: "text2image",
    aliases: ["text2img", "texttoimage", "texttoimg"],
    category: "ai-generate",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const ratio = ctx.args[0]?.includes(":") ? ctx.args[0] : "1:1";
        let input = ctx.args.slice(ratio.includes(":") ? 1 : 0).join(" ");
        if (!input && ctx.quoted?.body) input = ctx.quoted.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "16:9 anime girl with short blue hair")
            );

        try {
            const result = tools.api.createUrl("alwayscodex", "/api/imageai/text2image", {
                teks: input,
                ratio
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`,
                buttons: [{
                    text: "Ambil Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};