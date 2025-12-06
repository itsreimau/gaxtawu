module.exports = {
    name: "texttospeech",
    aliases: ["tts"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || ctx.quoted?.text || null;
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "id halo, dunia!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        try {
            const result = api.createUrl("znx", "/api/tools/tts", {
                text: input,
                lang: langCode
            });

            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};