const session = new Map();

module.exports = {
    name: "maths",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(tools.msg.info("Sesi permainan sedang berjalan!"));

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
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/maths", {
                level: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const game = {
                coin: levelBonus[input] || 100,
                timeout: result.time,
                answer: String(result.result)
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `✦ — ${result.str}\n` +
                    "\n" +
                    `❖ ${formatter.bold("Level")}: ${levels[result.mode]}\n` +
                    `❖ ${formatter.bold("Bonus")}: ${game.coin} koin\n` +
                    `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
                buttons: [{
                    text: "Menyerah",
                    id: `surrender_${ctx.used.command}`
                }]
            });

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            const playAgain = [{
                text: "Main Lagi",
                id: `${ctx.used.prefix + ctx.used.command} ${input}`
            }, {
                text: "Daftar Level",
                sections: [{
                    title: "Pilih Level",
                    highlight_label: "🌕",
                    rows: Object.keys(levels).map(level => ({
                        title: levels[level],
                        description: `Klik untuk memainkan level ${levels[level]}`,
                        id: `${ctx.used.prefix + ctx.used.command} ${level}`
                    }))
                }]
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.body?.toLowerCase();
                const participantDb = collCtx.db.user;
                const isParticipantUnlimited = collCtx.sender.isOwner() || participantDb?.premium;

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    collector.stop();
                    if (!isParticipantUnlimited) participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    participantDb.save();
                    await collCtx.reply({
                        text: tools.msg.info(`Benar! +${game.coin} koin`),
                        buttons: playAgain
                    });
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: tools.msg.info(`Anda menyerah! Jawaban: ${tools.msg.ucwords(game.answer)}`),
                        buttons: playAgain
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: tools.msg.info(`Waktu habis! Jawaban: ${tools.msg.ucwords(game.answer)}`),
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};

const levelBonus = {
    noob: 10,
    easy: 25,
    medium: 50,
    hard: 100,
    extreme: 250,
    impossible: 500,
    impossible2: 750,
    impossible3: 1000,
    impossible4: 1500,
    impossible5: 2000
};