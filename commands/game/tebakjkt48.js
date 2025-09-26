const { Baileys } = require("@itsreimau/gktw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "tebakjkt48",
    aliases: ["tebakjkt"],
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(formatter.quote("🎮 Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/ERLANRAHMAT/games/refs/heads/main/tebakjkt48.json");
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
                mimetype: tools.mime.lookup("jpeg"),
                caption: `${formatter.quote(`Bonus: ${game.coin} Koin`)}\n` +
                    formatter.quote(`Batas waktu: ${tools.msg.convertMsToDuration(game.timeout)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: "hint",
                    buttonText: {
                        displayText: "Petunjuk"
                    }
                }, {
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

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1
                    await participantDb.save();
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("💯 Benar!")}\n` +
                            formatter.quote(`+${game.coin} Koin`),
                        footer: config.msg.footer,
                        buttons: playAgain
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === "hint") {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === "surrender") {
                    session.delete(ctx.id);
                    collector.stop();
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("🏳️ Anda menyerah!")}\n` +
                            formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`),
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
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `${formatter.quote("⏱ Waktu habis!")}\n` +
                            formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`),
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