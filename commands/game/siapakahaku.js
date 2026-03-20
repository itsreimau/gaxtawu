const axios = require("axios");

const session = new Map();

module.exports = {
    name: "siapakahaku",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(`ⓘ ${formatter.italic("Sesi permainan sedang berjalan!")}`);

        try {
            const apiUrl = tools.api.createUrl("deline", "/game/siapakahaku");
            const result = (await axios.get(apiUrl)).data.result;

            const game = {
                coin: 5,
                timeout: 60000,
                answer: result.jawaban.toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.soal}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin\n` +
                    `➛ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
                buttons: [{
                    text: "Petunjuk",
                    id: `hint_${ctx.used.command}`
                }, {
                    text: "Menyerah",
                    id: `surrender_${ctx.used.command}`
                }]
            });

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            const playAgain = [{
                text: "Main Lagi",
                id: ctx.used.prefix + ctx.used.command
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.text?.toLowerCase();
                const participantDb = collCtx.db.user;

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    participantDb.save();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`Benar! +${game.coin} Koin`)}`,
                        buttons: playAgain
                    });
                } else if (participantAnswer === `hint_${ctx.used.command}`) {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await collCtx.reply(formatter.monospace(clue.toUpperCase()));
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`Anda menyerah! Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)}`,
                        buttons: playAgain
                    });
                } else if (tools.cmd.didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await collCtx.reply(`ⓘ ${formatter.italic("Sedikit lagi!")}`);
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: `ⓘ ${formatter.italic(`Waktu habis! Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)}`,
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};