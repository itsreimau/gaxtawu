const axios = require("axios");

const session = new Map();

module.exports = {
    name: "cerdascermat",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(`ⓘ ${formatter.italic("Sesi permainan sedang berjalan!")}`);

        try {
            const mapel = {
                bindo: "Bahasa Indonesia",
                tik: "Teknologi Informasi dan Komunikasi",
                pkn: "Pelajaran Pendidikan Pancasila dan Kewarganegaraan",
                bing: "Bahasa Inggris",
                penjas: "Pendidikan Jasmani dan Kesehatan",
                pai: "Pendidikan Agama Islam",
                matematika: "Matematika",
                jawa: "Bahasa Jawa",
                ips: "Ilmu Pengetahuan Sosial",
                ipa: "Ilmu Pengetahuan Alam"
            };
            const input = ctx.args?.[0] && mapel[ctx.args[0]] ? ctx.args[0] : "tik";
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/cc-sd", {
                matapelajaran: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data.soal);

            const game = {
                coin: 10,
                timeout: 60000,
                answerKey: result.jawaban_benar,
                answer: result.semua_jawaban.find(obj => Object.keys(obj)[0] === result.jawaban_benar)[result.jawaban_benar].toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.pertanyaan}\n` +
                    `${result.semua_jawaban.map(obj => {
                        const key = Object.keys(obj)[0];
                        return `${key.toUpperCase()}. ${obj[key]}`;
                    }).join("\n")}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Mata Pelajaran")}: ${mapel[input]}\n` +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin\n` +
                    `➛ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}\n` +
                    `➛ ${formatter.bold("Cara menjawab")}: Ketik A, B, C, atau D`,
                buttons: [{
                    buttonId: `surrender_${ctx.used.command}`,
                    buttonText: {
                        displayText: "Menyerah"
                    }
                }]
            });

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            const playAgain = [{
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Main Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                })
            }, {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "Daftar Mata Pelajaran",
                    sections: [{
                        title: "Pilih Mata Pelajaran",
                        highlight_label: "🌕",
                        rows: Object.keys(mapel).map(key => ({
                            title: key.toUpperCase(),
                            description: `Klik untuk memainkan mata pelajaran ${mapel[key]}`,
                            id: `${ctx.used.prefix + ctx.used.command} ${key}`
                        }))
                    }]
                })
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.text?.toLowerCase().trim();
                const participantDb = collCtx.db.user;

                if (participantAnswer === game.answerKey) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    await participantDb.save();
                    await collCtx.reply({
                        text: `✅ ${formatter.italic(`Benar! +${game.coin} Koin`)}`,
                        buttons: playAgain
                    });
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`Anda menyerah! Jawabannya adalah ${game.answer} (${game.answerKey.toUpperCase()}).`)}`,
                        buttons: playAgain
                    });
                    return;
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `ⓘ ${formatter.italic(`Waktu habis! Jawabannya adalah ${game.answer} (${game.answerKey.toUpperCase()}).`)}`,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};