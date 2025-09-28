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
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        const senderJid = ctx.sender.jid;

        if (accountJid === ctx.me.id || accountJid === ctx.me.lid) return await ctx.reply(formatter.quote("Tidak bisa menantang bot!"));
        if (accountJid === senderJid) return await ctx.reply(formatter.quote("Tidak bisa menantang diri sendiri!"));

        const existingGame = [...session.values()].find(game => game.players.includes(senderJid) || game.players.includes(accountJid));
        if (existingGame) return await ctx.reply(formatter.quote("Salah satu pemain sedang dalam sesi permainan!"));

        try {
            const game = {
                players: [senderJid, accountJid],
                coin: 10,
                timeout: 120000,
                choices: new Map(),
                started: false
            };

            await ctx.reply({
                text: `${formatter.quote(`Anda menantang @${accountId} untuk bermain suit!`)}\n` +
                    formatter.quote(`Bonus: ${game.coin} Koin`),
                mentions: [accountJid],
                footer: config.msg.footer,
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
                            text: formatter.quote(`@${accountId} menerima tantangan! Silahkan pilih di obrolan pribadi.`),
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });

                        const choiceText = formatter.quote("Silahkan pilih salah satu:");
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
                            footer: config.msg.footer,
                            buttons
                        });
                        await ctx.sendMessage(accountJid, {
                            text: choiceText,
                            footer: config.msg.footer,
                            buttons
                        });
                    } else if (participantAnswer === "reject") {
                        session.delete(senderJid);
                        session.delete(accountJid);
                        await ctx.sendMessage(m.id, {
                            text: formatter.quote(`@${accountId} menolak tantangan suit.`),
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
                            text: formatter.quote(`Anda memilih: ${choiceData.name}`)
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
                                await userDb.save();
                                coinText = `+${game.coin} Koin untuk @${ctx.getId(ctx.sender.jid)}`;
                            } else {
                                winnerText = `@${accountId} menang!`;
                                participantDb.coin += game.coin;
                                participantDb.winGame += 1
                                await participantDb.save();
                                coinText = `+${game.coin} Koin untuk @${accountId}`;
                            }

                            await ctx.reply({
                                text: `${formatter.quote("Hasil suit:")}\n` +
                                    `${formatter.quote(`@${ctx.getId(ctx.sender.jid)}: ${sChoice.name}`)}\n` +
                                    `${formatter.quote(`@${accountId}: ${aChoice.name}`)}\n` +
                                    `${formatter.quote(winnerText)}\n` +
                                    formatter.quote(coinText),
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
                    await ctx.reply(formatter.quote("⏱ Waktu habis!"));
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};