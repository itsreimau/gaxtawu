module.exports = {
    name: "magicstudio",
    aliases: ["magic", "magics", "mstudio"],
    category: "ai-generate",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const result = tools.api.createUrl("zell", "/ai/magicstudio", {
                prompt: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote(`Prompt: ${input}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};