const { randomUUID } = require("node:crypto");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "gpt"],
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

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        const senderDb = ctx.db.user;

        if (input.toLowerCase() === "reset") {
            (senderDb.sessionId ||= {}).chatgpt = randomUUID();
            senderDb.save();
            return await ctx.reply(tools.msg.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.sessionId?.chatgpt) {
                (senderDb.sessionId ||= {}).chatgpt = randomUUID();
                senderDb.save();
            }

            if (!!checkMedia || !!checkQuotedMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = tools.api.createUrl("alwayscodex", "/api/ai/gpt4o-mini", {
                    teks: input,
                    image: uploadUrl,
                    session: senderDb.sessionId.chatgpt
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(cleanAnomalyText(result));
            } else {
                const apiUrl = tools.api.createUrl("alwayscodex", "/api/ai/gpt4o-mini", {
                    teks: input,
                    session: senderDb.sessionId.chatgpt
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(cleanAnomalyText(result));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};

function cleanAnomalyText(text) {
    if (!text) return "";
    return text.replace(/-=- --/g, " ").replace(/-=-n---=-n--/g, " ");
}