const axios = require("axios");

module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "tool",
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "21 35")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (surat.toLowerCase() === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(`ⓘ ${formatter.italic("Surah harus berupa nomor antara 1 sampai 114!")}`);

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", `/penggguna/QuranJSON/master/surah/${surat}.json`);
            const result = (await axios.get(apiUrl)).data;
            const verses = result.verses;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);
                    const selectedVerses = verses.filter(vers => vers.number >= startAyat && vers.number <= endAyat);

                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(`ⓘ ${formatter.italic("Rentang ayat tidak valid!")}`);
                    if (!selectedVerses.length) return await ctx.reply(`ⓘ ${formatter.italic(`Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`)}`);

                    const versesText = selectedVerses.map(vers =>
                        `${formatter.bold(`Ayat ${vers.number}:`)}\n` +
                        `${vers.text}\n` +
                        formatter.italic(vers.translation_id)
                    ).join("\n");
                    await ctx.reply(
                        `${versesText}\n` +
                        "\n" +
                        `➛ ${formatter.bold("Surat")}: ${result.name}\n` +
                        `➛ ${formatter.bold("Arti")}: ${result.name_translations.id}`
                    );
                } else {
                    const singleAyat = parseInt(ayat);
                    const verse = verses.find(vers => vers.number === singleAyat);

                    if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(`ⓘ ${formatter.italic("Ayat harus berupa nomor yang valid dan lebih besar dari 0!")}`);
                    if (!verse) return await ctx.reply(`ⓘ ${formatter.italic(`Ayat ${singleAyat} tidak ada!`)}`);

                    await ctx.reply(
                        `${verse.text}\n` +
                        `${formatter.italic(verse.translation_id)}\n` +
                        "\n" +
                        `➛ ${formatter.bold("Surat")}: ${result.name}\n` +
                        `➛ ${formatter.bold("Arti")}: ${result.name_translations.id}\n` +
                        `➛ ${formatter.bold("Ayat")}: ${result.number}`
                    );
                }
            } else {
                const versesText = verses.map(vers =>
                    `${formatter.bold(`Ayat ${vers.number}:`)}\n` +
                    `${vers.text}\n` +
                    formatter.italic(vers.translation_id)
                ).join("\n");
                await ctx.reply(
                    `${versesText}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Surat")}: ${result.name}\n` +
                    `➛ ${formatter.bold("Arti")}: ${result.name_translations.id}`
                );
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};