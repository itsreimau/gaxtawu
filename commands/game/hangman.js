const session = new Map();

module.exports = {
    name: "hangman",
    category: "game",
    code: async (ctx) => {
        const sessionKey = `${ctx.id}_${ctx.sender.jid}`;

        if (session.has(sessionKey)) return await ctx.reply(tools.msg.info("Sesi permainan sedang berjalan!"));

        try {
            const words = (await axios.get("https://raw.githubusercontent.com/siuspsrb/database/main/game/kbbi.json")).data.filter(w => w.length > 1);
            const word = tools.cmd.getRandomElement(words);
            const game = {
                coin: 10,
                timeout: 60000,
                guessed: new Set(),
                lives: 6
            };

            session.set(sessionKey, true);

            await ctx.reply({
                text: `✦ — ${render(word, new Set())}\n` +
                    `Ketik huruf untuk menebak.\n` +
                    "\n" +
                    `❖ ${formatter.bold("Bonus")}: ${game.coin} koin\n` +
                    `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}\n` +
                    `❖ ${formatter.bold("Nyawa")}: ${game.lives}`,
                buttons: [{
                    text: "Menyerah",
                    id: `surrender_${ctx.used.command}`
                }]
            });

            const collector = ctx.MessageCollector({
                time: game.timeout,
                filter: (collCtx) => {
                    if (collCtx.sender.jid !== ctx.sender.jid) return false;
                    if (collCtx.msg.body?.startsWith(`surrender_`)) return true;
                    const body = collCtx.msg.body?.toLowerCase() || "";
                    return body.length === 1 && /[a-z]/.test(body);
                }
            });

            const playAgain = [{
                text: "Main Lagi",
                id: ctx.used.prefix + ctx.used.command
            }];

            collector.on("collect", async (collCtx) => {
                const answer = collCtx.msg.body?.toLowerCase();
                const isUnlimited = collCtx.sender.isOwner() || participantDb?.premium;

                if (answer === `surrender_${ctx.used.command}`) {
                    session.delete(sessionKey);
                    collector.stop();
                    return await collCtx.reply({
                        text: tools.msg.info(`Anda menyerah! Jawaban: ${word}`),
                        buttons: playAgain
                    });
                }

                if (game.guessed.has(answer)) return await collCtx.reply("Huruf sudah ditebak!");

                game.guessed.add(answer);

                if (!word.includes(answer)) {
                    game.lives--;
                    if (game.lives <= 0) {
                        session.delete(sessionKey);
                        collector.stop();
                        return await collCtx.reply({
                            text: tools.msg.info(`Permainan berakhir! Jawaban: ${word}`),
                            buttons: playAgain
                        });
                    }
                }

                const display = render(word, game.guessed);

                if (!display.includes("_")) {
                    session.delete(sessionKey);
                    collector.stop();

                    const senderDb = collCtx.db.user;
                    if (isUnlimited) senderDb.coin += game.coin;
                    senderDb.winGame += 1;
                    senderDb.save();
                    return await collCtx.reply({
                        text: tools.msg.info(`Benar! Jawaban: ${word} +${game.coin} koin`),
                        buttons: playAgain
                    });
                }

                await collCtx.reply(
                    `✦ — ${display}\n` +
                    `Ketik huruf untuk menebak lagi.\n` +
                    "\n" +
                    `❖ ${formatter.bold("Nyawa")}: ${game.lives}\n` +
                    `❖ ${formatter.bold("Huruf")}: ${[...game.guessed].join(", ")}`
                );
            });

            collector.on("end", async () => {
                if (session.has(sessionKey)) {
                    session.delete(sessionKey);
                    await ctx.reply({
                        text: tools.msg.info(`Waktu habis! Jawaban: ${word}`),
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};

function render(word, guessed) {
    return word.split("").map(c => (guessed.has(c) ? c : "_")).join(" ");
}