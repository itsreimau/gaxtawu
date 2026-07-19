module.exports = {
    name: "alkitab",
    aliases: ["bible"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [passage, number] = ctx.args;

        if (!passage && !number)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.msg.generateCmdExample(ctx.used, "kej 2:18")}\n` +
                ctx.msg.generateNotes([
                    `Ketik ${ctx.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (passage.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "alkitab");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = ctx.api.createUrl("https://api-alkitab.vercel.app", "/api/passage", {
                passage,
                num: number
            });
            const result = (await ctx.request.get(apiUrl)).data.bible.book;

            const resultText = result.chapter.verses.map(vers =>
                `❖ ${ctx.msg.bold("Ayat")}: ${vers.number}\n` +
                vers.text
            ).join("\n");
            await ctx.reply(
                `${resultText}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Nama")}: ${result.name}\n` +
                `❖ ${ctx.msg.bold("Bab")}: ${result.chapter.chap}`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};