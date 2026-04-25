const axios = require("axios");

module.exports = {
    name: "qwen",
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
                tools.msg.generateNotes(["AI ini dapat melihat media."])
            );

        if (input === "reset") {
            const senderDb = ctx.db.user;
            delete senderDb.qwenSessionId;
            return await ctx.reply(`ⓘ ${formatter.italic("Riwayat percakapan berhasil direset!")}`);
        }

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["audio", "document", "image", "sticker", "video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio", "document", "image", "sticker", "video"])
        ];

        try {
            const instruction = `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`;
            const mode = "auto";
            const model = "auto";
            const senderDb = ctx.db.user;
            const sessionId = senderDb.qwenSessionId || "";
            const media = checkMedia || checkQuotedMedia;

            if (!!media) {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const apiUrl = tools.api.createUrl("omegatech", "/api/ai/qwen-3-vl", {
                    text: input,
                    userId: sessionId,
                    [media === "audio" ? "audio" : media === "video" ? "video" : media === "image" ? "image" : "file"]: uploadUrl,
                    mode,
                    model,
                    system: instruction
                });
                const result = (await axios.get(apiUrl)).data;
                if (!sessionId) {
                    senderDb.qwenSessionId = result.sessionId;
                    senderDb.save();
                }

                await ctx.reply({
                    richResponse: [{
                        text: result.result
                    }]
                });
            } else {
                const apiUrl = tools.api.createUrl("omegatech", "/api/ai/qwen-3-vl", {
                    text: input,
                    userId: sessionId,
                    mode,
                    model,
                    system: instruction
                });
                const result = (await axios.get(apiUrl)).data;
                if (!sessionId) {
                    senderDb.qwenSessionId = result.sessionId;
                    senderDb.save();
                }

                await ctx.reply({
                    richResponse: [{
                        text: result.result
                    }]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};