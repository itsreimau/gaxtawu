const axios = require("axios");

const session = new Map();

module.exports = {
    name: "maths",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(`ⓘ ${formatter.italic("Sesi permainan sedang berjalan!")}`);

        try {
            const levels = {
                noob: "Noob",
                easy: "Mudah",
                medium: "Sedang",
                hard: "Sulit",
                extreme: "Ekstrim",
                impossible: "Mustahil",
                impossible2: "Mustahil II",
                impossible3: "Mustahil III",
                impossible4: "Mustahil IV",
                impossible5: "Mustahil V"
            };
            const input = ctx.args?.[0] && levels.hasOwnProperty(ctx.args[0]) ? ctx.args[0] : "random";
            const apiUrl = tools.api.createUrl("deline", "/game/maths", {
                level: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const game = {
                coin: 5,
                timeout: 60000,
                answer: result.jawaban.toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.pertanyaan}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Level")}: ${levels[result.mode]}\n` +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin\n` +
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
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Main Lagi",
                    id: `${ctx.used.prefix + ctx.used.command} ${input}`
                })
            }, {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "Daftar Level",
                    sections: [{
                        title: "Pilih Level",
                        highlight_label: "🌕",
                        rows: Object.keys(levels).map(level => ({
                            title: levels[level],
                            description: `Klik untuk memainkan level ${levels[level]}`,
                            id: `${ctx.used.prefix + ctx.used.command} ${level}`
                        }))
                    }]
                })
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
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: `ⓘ ${formatter.italic(`Anda menyerah! Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)}`,
                        buttons: playAgain
                    });
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