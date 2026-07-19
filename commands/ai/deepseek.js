module.exports = {
    name: "deepseek",
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                ctx.msg.generateNotes([
                    `Ketik ${ctx.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                ])
            );

        const senderDb = ctx.db.user;

        if (input.toLowerCase() === "reset") {
            (senderDb.sessionId ||= {}).deepseek = tools.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(ctx.msg.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.sessionId?.deepseek) {
                (senderDb.sessionId ||= {}).deepseek = tools.helper.randomUUID();
                senderDb.save();
            }
            const apiUrl = ctx.api.createUrl("alwayscodex", "/api/ai/deepseek-flash", {
                teks: input,
                session: senderDb.sessionId.deepseek
            });
            const result = (await ctx.request.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};