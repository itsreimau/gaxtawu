module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "tool",
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.msg.generateCmdExample(ctx.used, "21 35")}\n` +
                ctx.msg.generateNotes([
                    `Ketik ${ctx.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (surat.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(ctx.msg.info("Surah harus berupa nomor antara 1 sampai 114!"));

        try {
            const apiUrl = ctx.api.createUrl("https://islami.api.akuari.my.id", "/alquran", {
                query: surat
            });
            const result = (await ctx.request.get(apiUrl)).data.result;
            const verses = result.verses;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);
                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(ctx.msg.info("Rentang ayat tidak valid!"));
                    const selectedVerses = verses.filter(vers => vers.number >= startAyat && vers.number <= endAyat);
                    if (!selectedVerses.length) return await ctx.reply(ctx.msg.info(`Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`));

                    const versesText = selectedVerses.map(vers =>
                        `❖ ${ctx.msg.bold("Ayat")}: ${vers.number}\n` +
                        `${vers.text}\n` +
                        ctx.msg.italic(vers.translation_id)
                    ).join("\n");
                    await ctx.reply(
                        `${versesText}\n` +
                        "\n" +
                        `❖ ${ctx.msg.bold("Surat")}: ${result.name}\n` +
                        `❖ ${ctx.msg.bold("Arti")}: ${result.name_translations.id}`
                    );
                } else {
                    const singleAyat = parseInt(ayat, 10);
                    if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(ctx.msg.info("Ayat harus berupa nomor yang valid dan lebih besar dari 0!"));
                    const verse = verses.find(vers => vers.number === singleAyat);
                    if (!verse) return await ctx.reply(ctx.msg.info(`Ayat ${singleAyat} tidak ada!`));

                    await ctx.reply(
                        `${verse.text}\n` +
                        `${ctx.msg.italic(verse.translation_id)}\n` +
                        "\n" +
                        `❖ ${ctx.msg.bold("Surat")}: ${result.name}\n` +
                        `❖ ${ctx.msg.bold("Arti")}: ${result.name_translations.id}\n` +
                        `❖ ${ctx.msg.bold("Ayat")}: ${singleAyat}`
                    );
                }
            } else {
                const versesText = verses.map(vers =>
                    `❖ ${ctx.msg.bold("Ayat")}: ${vers.number}\n` +
                    `${vers.text}\n` +
                    ctx.msg.italic(vers.translation_id)
                ).join("\n");
                await ctx.reply(
                    `${versesText}\n` +
                    "\n" +
                    `❖ ${ctx.msg.bold("Surat")}: ${result.name}\n` +
                    `❖ ${ctx.msg.bold("Arti")}: ${result.name_translations.id}`
                );
            }
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};