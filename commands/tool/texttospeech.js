module.exports = {
    name: "texttospeech",
    aliases: ["tts"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";
        const input = ctx.text ? (ctx.text.startsWith(`${langCode} `) ? ctx.text.slice(langCode.length + 1) : ctx.text) : (ctx.quoted?.text || null);

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "id halo, dunia!")
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