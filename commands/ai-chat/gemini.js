const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "gemini",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx?.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "apa itu evangelion?"))}\n` +
            formatter.quote(tools.msg.generateNotes(["AI ini dapat melihat gambar.", "Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        const [checkMedia, checkQuotedMedia] = Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx?.quoted?.contentType, "image")
        ]);

        try {
            const systemPrompt = `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.` // Dapat diubah sesuai keinginan

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = await Baileys.uploadFile(buffer);
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gemini/1.5-flash", {
                    text: input,
                    systemPrompt,
                    imageUrl: uploadUrl,
                    sessionId: await db.get(`user.${ctx.keyDb.user}.uid`) || "guest"
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/gemini/1.5-flash", {
                    text: input,
                    systemPrompt,
                    sessionId: await db.get(`user.${ctx.keyDb.user}.uid`) || "guest"
                });
                const result = (await axios.get(apiUrl)).data.result;

                await ctx.reply(result);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};