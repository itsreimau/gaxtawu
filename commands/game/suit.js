const { Baileys } = require("@itsreimau/gktw");

const session = new Map();

module.exports = {
    name: "suit",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        const targetJid = ctx.getMentioned()[0] || ctx.quoted?.sender || null;
        const targetId = ctx.getId(targetJid);

        if (!targetJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        const senderJid = ctx.sender.jid;

        if (targetJid === ctx.me.lid || targetJid === ctx.me.id) return await ctx.reply(`ⓘ ${formatter.italic("Tidak bisa menantang bot!")}`);
        if (targetJid === senderJid) return await ctx.reply(`ⓘ ${formatter.italic("Tidak bisa menantang diri sendiri!")}`);

        const existingGame = [...session.values()].find(game => game.players.includes(senderJid) || game.players.includes(targetJid));
        if (existingGame) return await ctx.reply(`ⓘ ${formatter.italic("Salah satu pemain sedang dalam sesi permainan!")}`);

        try {
            const game = {
                players: [senderJid, targetJid],
                coin: 5,
                timeout: 120000,
                choices: new Map(),
                started: false
            };

            await ctx.reply({
                text: `— Anda menantang @${targetId} untuk bermain suit!\n` +
                    "\n" +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Koin`,
                mentions: [targetJid],
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
            session.set(targetJid, game);

            const collector = ctx.MessageCollector({
                filter: (m) => [senderJid, targetJid].includes(m.sender),
                time: game.timeout,
                hears: [senderJid, targetJid]
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantJid = m.sender;
                const participantId = ctx.getId(m.sender);
                const isGroup = Baileys.isJidGroup(m.id);

                if (!game.started && isGroup && participantId === targetId) {
                    if (participantAnswer === "accept") {
                        game.started = true;
                        await ctx.core.sendMessage(m.id, {
                            text: `ⓘ ${formatter.italic(`@${targetId} menerima tantangan! Silahkan pilih di obrolan pribadi.`)}`,
                            mentions: [targetJid]
                        }, {
                            quoted: m
                        });

                        const choiceText = `ⓘ ${formatter.italic("Silahkan pilih salah satu:")}`;
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

                        await ctx.core.sendMessage(senderJid, {
                            text: choiceText,
                            buttons
                        });
                        await ctx.core.sendMessage(targetJid, {
                            text: choiceText,
                            buttons
                        });
                    } else if (participantAnswer === "reject") {
                        session.delete(senderJid);
                        session.delete(targetJid);
                        await ctx.core.sendMessage(m.id, {
                            text: `ⓘ ${formatter.italic(`@${targetId} menolak tantangan suit.`)}`,
                            mentions: [targetJid]
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

                        await ctx.core.sendMessage(participantJid, {
                            text: `ⓘ ${formatter.italic(`Anda memilih: ${choiceData.name}`)}`
                        }, {
                            quoted: m
                        });

                        if (game.choices.size === 2) {
                            const [sChoice, aChoice] = [game.choices.get(ctx.getId(ctx.sender.jid)), game.choices.get(targetId)];

                            const result = (3 + sChoice.index - aChoice.index) % 3;
                            let winnerText, coinText = "Tak seorang pun menang, tak seorang pun mendapat koin";
                            const senderDb = ctx.db.user;
                            const targetDb = ctx.getDb("users", targetId);

                            if (result === 0) {
                                winnerText = "Seri!";
                            } else if (result === 1) {
                                winnerText = `@${ctx.getId(ctx.sender.jid)} menang!`;
                                senderDb.coin += game.coin;
                                senderDb.winGame += 1;
                                senderDb.save();
                                coinText = `+${game.coin} Koin untuk @${ctx.getId(ctx.sender.jid)}`;
                            } else {
                                winnerText = `@${targetId} menang!`;
                                targetDb.coin += game.coin;
                                targetDb.winGame += 1;
                                targetDb.save();
                                coinText = `+${game.coin} Koin untuk @${targetId}`;
                            }

                            await ctx.reply({
                                text: `— ${winnerText} ${coinText}\n` +
                                    "\n" +
                                    `➛ @${ctx.getId(ctx.sender.jid)}: ${sChoice.name}\n` +
                                    `➛ @${targetId}: ${aChoice.name}`,
                                mentions: [senderJid, targetJid]
                            });

                            session.delete(senderJid);
                            session.delete(targetJid);
                        }
                    }
                }
            });

            collector.on("end", async () => {
                if (session.has(senderJid) || session.has(targetJid)) {
                    session.delete(senderJid);
                    session.delete(targetJid);
                    await ctx.reply(`ⓘ ${formatter.italic("Waktu habis!")}`);
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};