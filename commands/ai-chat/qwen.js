const { randomUUID } = require("node:crypto");

module.exports = {
    name: "qwen",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                ])
            );

        const senderDb = ctx.db.user;

        if (input.toLowerCase() === "reset") {
            (senderDb.sessionId ||= {}).qwen = randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.sessionId?.qwen) {
                (senderDb.sessionId ||= {}).qwen = randomUUID();
                senderDb.save();
            }
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/ai/qwen3", {
                teks: input,
                session: senderDb.sessionId.qwen
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(result);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};