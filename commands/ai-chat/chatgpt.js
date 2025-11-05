const axios = require("axios");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "gpt"],
    category: "ai-chat",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?")}\n` +
            tools.msg.generateNotes(["AI ini dapat melihat gambar.", "Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image")
        ];

        try {
            const systemPrompt = `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.` // Dapat diubah sesuai keinginan
            const uid = ctx.db.user.uid || "guest";

            if (!!checkMedia || !!checkQuotedMedia) {
                const buffer = await ctx.msg.download() || await ctx.quoted.download();
                const uploadUrl = await ctx.core.rexx.utils.uploadFile(buffer);
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gpt/5", {
                    text: input,
                    systemPrompt,
                    imageUrl: uploadUrl,
                    sessionId: uid
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gpt/5", {
                    text: input,
                    systemPrompt,
                    sessionId: uid
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};