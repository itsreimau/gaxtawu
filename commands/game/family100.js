const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "family100",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(formatter.quote("🎮 Sesi permainan sedang berjalan!"));

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
                text: `${formatter.quote(`Soal: ${result.soal}`)}\n` +
                    `${formatter.quote(`Jumlah jawaban: ${game.answers.size}`)}\n` +
                    formatter.quote(`Batas waktu: ${tools.msg.convertMsToDuration(game.timeout)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: "surrender",
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

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantDb = ctx.getDb("users", m.sender);

                if (game.answers.has(participantAnswer)) {
                    game.answers.delete(participantAnswer);
                    game.participants.add(participantId);

                    participantDb.coin += game.coin.answered;
                    participantDb.save();
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.quote(`✅ ${tools.msg.ucwords(participantAnswer)} benar! Jawaban tersisa: ${game.answers.size}`)
                    }, {
                        quoted: m
                    });

                    if (game.answers.size === 0) {
                        session.delete(ctx.id);
                        collector.stop();
                        for (const participant of game.participants) {
                            participantDb.coin += game.coin.allAnswered;
                            participantDb.winGame += 1
                            participantDb.save();
                        }
                        await ctx.sendMessage(ctx.id, {
                            text: formatter.quote(`🎉 Selamat! Semua jawaban telah terjawab! Setiap anggota yang menjawab mendapat ${game.coin.allAnswered} koin.`),
                            footer: config.msg.footer,
                            buttons: playAgain
                        }, {
                            quoted: m
                        });
                    }
                } else if (participantAnswer === "surrender") {
                    const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", dan $1");
                    session.delete(ctx.id);
                    collector.stop();
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("🏳️ Anda menyerah!")}\n` +
                            formatter.quote(`Jawaban yang belum terjawab adalah ${remaining}.`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                } else if (Baileys.didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.quote("🎯 Sedikit lagi!")
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async () => {
                const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", dan $1");

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `${formatter.quote("⏱ Waktu habis!")}\n` +
                            formatter.quote(`Jawaban yang belum terjawab adalah ${remaining}`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};