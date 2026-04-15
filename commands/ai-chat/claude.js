const axios = require("axios");

module.exports = {
    name: "claude",
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")
            );

        if (input === "reset") {
            const senderDb = ctx.db.user;
            delete senderDb.claudeSessionId;
            return await ctx.reply(`ⓘ ${formatter.italic("Riwayat percakapan berhasil direset!")}`)
        }

        try {
            const senderDb = ctx.db.user;
            const sessionId = senderDb.claudeSessionId || "";
            const apiUrl = tools.api.createUrl("omegatech", "/api/ai/claude-pro", {
                prompt: input,
                sessionId
            });
            const result = (await axios.get(apiUrl)).data;
            if (!sessionId) {
                senderDb.claudeSessionId = result.sessionId;
                senderDb.save();
            }

            await ctx.reply({
                richResponse: [{
                    text: result.response
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};