const axios = require("axios");
const crypto = require("node:crypto");

module.exports = {
    name: "groq",
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

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
            senderDb.groqSessionId = crypto.randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.groqSessionId) {
                senderDb.groqSessionId = crypto.randomUUID();
                senderDb.save();
            }
            const apiUrl = tools.api.createUrl("nekolabs", "/text.gen/groq/compound", {
                text: input,
                systemPrompt: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`,
                sessionId: senderDb.groqSessionId
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                richResponse: [{
                    text: result
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};