const { Gktw } = require("@itsreimau/gktw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "tebakgame",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(formatter.italic("ⓘ Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/Aiinne/scrape/refs/heads/main/tebakgame.json");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: 10,
                timeout: 60000,
                answer: result.jawaban.toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                image: {
                    url: result.img
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin\n` +
                    `➛ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeoute}`,
                buttons: [{
                    buttonId: `hint_${ctx.used.command}`,
                    buttonText: {
                        displayText: "Petunjuk"
                    }
                }, {
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

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantDb = ctx.getDb("users", m.sender);

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1
                    participantDb.save();
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.italic("ⓘ Benar!")}\n` +
                            `+${game.coin} Koin`,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === `hint_${ctx.used.command}`) {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.italic("ⓘ Anda menyerah!")}\n` +
                            `Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                } else if (Gktw.didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.italic("ⓘ Sedikit lagi!")
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `${formatter.italic("ⓘ Waktu habis!")}\n` +
                            `Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};