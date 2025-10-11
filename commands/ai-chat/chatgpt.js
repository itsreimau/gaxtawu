const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "cgpt", "chatai", "gpt", "openai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?"))}\n` +
            formatter.quote(tools.msg.generateNotes(["AI ini dapat melihat gambar.", "Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        try {
            const systemPrompt = `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.` // Dapat diubah sesuai keinginan
            const uid = ctx.db.user.uid;

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = (await Baileys.uploadFile(buffer)).data.url;
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gpt/5", {
                    text: input,
                    systemPrompt,
                    imageUrl: uploadUrl,
                    sessionId: uid || "guest"
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gpt/5", {
                    text: input,
                    systemPrompt,
                    sessionId: uid || "guest"
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};