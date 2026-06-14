module.exports = {
    name: "texttospeech",
    aliases: ["tts"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";
        let input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ");
        if (!input && ctx.quoted?.body) input = ctx.quoted.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "id halo, dunia!")}\n` +
                tools.msg.generateNotes([
                    "Gunakan kode bahasa 2 huruf, periksa daftar lengkapnya di Google. (contoh: en, id, ja, ar, ko)"
                ])
            );

        try {
            const apiUrl = tools.api.createUrl("delirius", "/tools/gtts", {
                text: input,
                language: langCode
            });
            const result = (await axios.get(apiUrl)).data.data.download;

            await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: "audio/mpeg"
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};