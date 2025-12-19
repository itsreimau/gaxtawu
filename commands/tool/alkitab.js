const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["bible"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const [passage, number] = ctx.args;

        if (!passage && !number)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "kej 2:18")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (passage.toLowerCase() === "list") {
            const listText = await tools.list.get("alkitab");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("https://api-alkitab.vercel.app", `/api/passage`, {
                passage,
                num: number
            });
            const result = (await axios.get(apiUrl)).data.bible.book;

            const resultText = result.chapter.verses.map(res =>
                `${formatter.bold(`Ayat ${res.number}`)}:\n` +
                res.text
            ).join("\n");
            await ctx.reply(
                `${resultText}\n` +
                "\n" +
                `➛ ${formatter.bold("Nama")}: ${result.name}\n` +
                `➛ ${formatter.bold("Bab")}: ${result.chapter.chap}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};