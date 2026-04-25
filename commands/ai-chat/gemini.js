const axios = require("axios");

module.exports = {
    name: "gemini",
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
                tools.msg.generateNotes(["AI ini dapat melihat gambar."])
            );

        if (input === "reset") {
            const senderDb = ctx.db.user;
            delete senderDb.geminiHistoryChat;
            return await ctx.reply(`ⓘ ${formatter.italic("Riwayat percakapan berhasil direset!")}`);
        }

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        try {
            const mode = "chat";
            const senderDb = ctx.db.user;
            const historyChat = senderDb.geminiHistoryChat || "";

            if (!!checkMedia || !!checkQuotedMedia) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = tools.api.createUrl("zenzxz", "/ai/gemini", {
                    prompt: input,
                    mode,
                    media: uploadUrl,
                    history: historyChat
                });
                const result = (await axios.get(apiUrl)).data.result;
                if (!historyChat) {
                    senderDb.geminiHistoryChat = JSON.stringify(result.history);
                    senderDb.save();
                }

                await ctx.reply({
                    richResponse: [{
                        text: result.reply
                    }]
                });
            } else {
                const apiUrl = tools.api.createUrl("zenzxz", "/ai/gemini", {
                    prompt: input,
                    mode: "chat",
                    history: historyChat
                });
                const result = (await axios.get(apiUrl)).data.result;
                if (!historyChat) {
                    senderDb.geminiHistoryChat = JSON.stringify(result.history);
                    senderDb.save();
                }

                await ctx.reply({
                    richResponse: [{
                        text: result.reply
                    }]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};