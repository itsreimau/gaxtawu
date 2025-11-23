const { Gktw } = require("@itsreimau/gktw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "family100",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(`ⓘ ${formatter.italic("Sesi permainan sedang berjalan!")}`);

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/refs/heads/master/games/family100.json");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: {
                    answered: 10,
                    allAnswered: 100
                },
                timeout: 90000,
                answers: new Set(result.jawaban.map(ans => ans.toLowerCase())),
                participants: new Set()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.soal}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin.answered} Koin untuk 1 jawaban benar, ${game.coin.allAnswered} Koin untuk semua jawaban benar\n` +
                    `➛ ${formatter.bold("Jumlah jawaban")}: ${game.answers.size}\n` +
                    `➛ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
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
                buttonId: ctx.used.prefix + ctx.used.command,
                buttonText: {
                    displayText: "Main Lagi"
                }
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.text.toLowerCase();
                const participantDb = ctx.getDb("users", collCtx.sender.jid);

                if (game.answers.has(participantAnswer)) {
                    game.answers.delete(participantAnswer);
                    game.participants.add(participantId);

                    participantDb.coin += game.coin.answered;
                    participantDb.save();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`${tools.msg.ucwords(participantAnswer)} benar! Jawaban tersisa: ${game.answers.size}`)}`
                    });

                    if (game.answers.size === 0) {
                        session.delete(ctx.id);
                        collector.stop();
                        for (const participant of game.participants) {
                            participantDb.coin += game.coin.allAnswered;
                            participantDb.winGame += 1;
                            participantDb.save();
                        }
                        await collCtx.reply({
                            text: `ⓘ ${formatter.italic(`Selamat! Semua jawaban telah terjawab! Setiap anggota yang menjawab mendapat ${game.coin.allAnswered} koin.`)}`,
                            buttons: playAgain
                        });
                    }
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", dan $1");
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`Anda menyerah! Jawaban yang belum terjawab adalah ${remaining}.`)}`,
                        buttons: playAgain
                    });
                } else if (Gktw.didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await collCtx.reply(`ⓘ ${formatter.italic("Sedikit lagi!")}`);
                }
            });

            collector.on("end", async () => {
                const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", dan $1");

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `ⓘ ${formatter.italic(`Waktu habis! Jawaban yang belum terjawab adalah ${remaining}.`)}`,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};