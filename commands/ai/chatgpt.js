module.exports = {
    name: "chatgpt",
    aliases: ["ai", "gpt"],
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
                ctx.format.generateNotes([
                    `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                ])
            );

        const isMedia = ctx.isMedia(["image"]);

        const senderDb = ctx.db.user;

        if (input.toLowerCase() === "reset") {
            (senderDb.sessionId ||= {}).chatgpt = tools.helper.randomUUID();
            senderDb.save();
            return await ctx.reply(ctx.format.info("Riwayat percakapan berhasil direset!"));
        }

        try {
            if (!senderDb.sessionId?.chatgpt) {
                (senderDb.sessionId ||= {}).chatgpt = tools.helper.randomUUID();
                senderDb.save();
            }

            if (!!isMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = ctx.api.createUrl("alwayscodex", "/api/ai/gpt4o-mini", {
                    teks: input,
                    image: uploadUrl,
                    session: senderDb.sessionId.chatgpt
                });
                const result = (await ctx.request.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = ctx.api.createUrl("alwayscodex", "/api/ai/gpt4o-mini", {
                    teks: input,
                    session: senderDb.sessionId.chatgpt
                });
                const result = (await ctx.request.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};