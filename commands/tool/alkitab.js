const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["bible"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [passage, num] = ctx.args;

        if (!passage && !num) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "kej 2:18"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (passage.toLowerCase() === "list") {
            const listText = await tools.list.get("alkitab");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const apiUrl = tools.api.createUrl("https://api-alkitab.vercel.app", `/api/passage`, {
                passage,
                num
            });
            const result = (await axios.get(apiUrl)).data.bible.book;

            const resultText = result.chapter.verses.map(vers =>
                `${formatter.quote(`Ayat: ${vers.number}`)}\n` +
                formatter.quote(`${vers.text}`)
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
            );
            return await ctx.reply({
                text: `${formatter.quote(`Nama: ${result.name}`)}\n` +
                    `${formatter.quote(`Bab: ${result.chapter.chap}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    resultText,
                footer: config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};