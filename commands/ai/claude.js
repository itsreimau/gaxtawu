module.exports = {
    name: "claude",
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.text.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                ctx.text.generateNotes([
                    `Ketik ${ctx.text.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                ])
            );

        const senderDb = ctx.db.user;

        if (input.toLowerCase() === "reset") {
            (senderDb.sessionId ||= {}).claude = tools.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(ctx.text.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.sessionId?.claude) {
                (senderDb.sessionId ||= {}).claude = tools.helper.randomUUID();
                senderDb.save();
            }
            const apiUrl = ctx.api.createUrl("alwayscodex", "/api/ai/chatgpt-org", {
                teks: input,
                model: "anthropic/claude-haiku-4-5",
                session: senderDb.sessionId.claude
            });
            const result = (await ctx.request.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};