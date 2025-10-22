const { Baileys } = require("@itsreimau/gktw");

const session = new Map();

module.exports = {
    name: "suit",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.getMentioned()[0] || ctx.quoted?.sender || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        const senderJid = ctx.sender.jid;

        if (accountJid === ctx.me.lid || accountJid === ctx.me.id) return await ctx.reply(formatter.italic("ⓘ Tidak bisa menantang bot!"));
        if (accountJid === senderJid) return await ctx.reply(formatter.italic("ⓘ Tidak bisa menantang diri sendiri!"));

        const existingGame = [...session.values()].find(game => game.players.includes(senderJid) || game.players.includes(accountJid));
        if (existingGame) return await ctx.reply(formatter.italic("ⓘ Salah satu pemain sedang dalam sesi permainan!"));

        try {
            const game = {
                players: [senderJid, accountJid],
                coin: 10,
                timeout: 120000,
                choices: new Map(),
                started: false
            };

            await ctx.reply({
                text: `— Anda menantang @${accountId} untuk bermain suit!\n` +
                    "\n" +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin`,
                mentions: [accountJid],
                buttons: [{
                    buttonId: "accept",
                    buttonText: {
                        displayText: "Terima"
                    }
                }, {
                    buttonId: "reject",
                    buttonText: {
                        displayText: "Tolak"
                    }
                }]
            });

            session.set(senderJid, game);
            session.set(accountJid, game);

            const collector = ctx.MessageCollector({
                filter: (m) => [senderJid, accountJid].includes(m.sender),
                time: game.timeout,
                hears: [senderJid, accountJid]
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantJid = m.sender;
                const participantId = ctx.getId(m.sender);
                const isGroup = Baileys.isJidGroup(m.id);

                if (!game.started && isGroup && participantId === accountId) {
                    if (participantAnswer === "accept") {
                        game.started = true;
                        await ctx.sendMessage(m.id, {
                            text: `@${accountId} menerima tantangan! Silahkan pilih di obrolan pribadi.`,
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });

                        const choiceText = "Silahkan pilih salah satu:";
                        const buttons = [{
                            buttonId: "batu",
                            buttonText: {
                                displayText: "Batu"
                            }
                        }, {
                            buttonId: "kertas",
                            buttonText: {
                                displayText: "Kertas"
                            }
                        }, {
                            buttonId: "gunting",
                            buttonText: {
                                displayText: "Gunting"
                            }
                        }];

                        await ctx.sendMessage(senderJid, {
                            text: choiceText,
                            buttons
                        });
                        await ctx.sendMessage(accountJid, {
                            text: choiceText,
                            buttons
                        });
                    } else if (participantAnswer === "reject") {
                        session.delete(senderJid);
                        session.delete(accountJid);
                        await ctx.sendMessage(m.id, {
                            text: `@${accountId} menolak tantangan suit.`,
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });

                    }
                }

                if (!isGroup && game.started) {
                    const choices = {
                        batu: {
                            index: 0,
                            name: "Batu"
                        },
                        kertas: {
                            index: 1,
                            name: "Kertas"
                        },
                        gunting: {
                            index: 2,
                            name: "Gunting"
                        }
                    };
                    const choiceData = choices[participantAnswer];

                    if (choiceData) {
                        game.choices.set(participantId, choiceData);

                        await ctx.sendMessage(participantJid, {
                            text: `Anda memilih: ${choiceData.name}`
                        }, {
                            quoted: m
                        });

                        if (game.choices.size === 2) {
                            const [sChoice, aChoice] = [
                                game.choices.get(ctx.getId(ctx.sender.jid)),
                                game.choices.get(accountId)
                            ];

                            const result = (3 + sChoice.index - aChoice.index) % 3;
                            let winnerText, coinText = "Tak seorang pun menang, tak seorang pun mendapat koin";
                            const userDb = ctx.db.user;
                            const participantDb = ctx.getDb("users", accountId);

                            if (result === 0) {
                                winnerText = "Seri!";
                            } else if (result === 1) {
                                winnerText = `@${ctx.getId(ctx.sender.jid)} menang!`;
                                userDb.coin += game.coin;
                                userDb.winGame += 1
                                userDb.save();
                                coinText = `+${game.coin} Koin untuk @${ctx.getId(ctx.sender.jid)}`;
                            } else {
                                winnerText = `@${accountId} menang!`;
                                participantDb.coin += game.coin;
                                participantDb.winGame += 1
                                participantDb.save();
                                coinText = `+${game.coin} Koin untuk @${accountId}`;
                            }

                            await ctx.reply({
                                text: `Hasil suit:\n` +
                                    `@${ctx.getId(ctx.sender.jid)}: ${sChoice.name}\n` +
                                    `@${accountId}: ${aChoice.name}\n` +
                                    `${winnerText} ${coinText}`,
                                mentions: [senderJid, accountJid]
                            });

                            session.delete(senderJid);
                            session.delete(accountJid);

                        }
                    }
                }
            });

            collector.on("end", async () => {
                if (session.has(senderJid) || session.has(accountJid)) {
                    session.delete(senderJid);
                    session.delete(accountJid);
                    await ctx.reply(`ⓘ ${formatter.italic("Waktu habis!")}`);
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};