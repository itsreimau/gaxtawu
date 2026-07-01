const sessions = new Map();

class TebakGame {
    constructor(config) {
        this.name = config.name;
        this.apiEndpoint = config.apiEndpoint;
        this.coinReward = config.coinReward || 5;
        this.hintCost = config.hintCost || 3;
        this.timeout = config.timeout || 60000;
        this.answerKey = config.answerKey || "jawaban";
        this.questionKey = config.questionKey || "soal";
        this.imageKey = config.imageKey || null;
        this.audioKey = config.audioKey || null;
        this.extraFields = config.extraFields || [];
        this.formatQuestion = config.formatQuestion || this.defaultFormatQuestion;
        this.formatAnswer = config.formatAnswer || this.defaultFormatAnswer;
    }

    defaultFormatQuestion(data) {
        let text = `✦ — ${data[this.questionKey]}\n` +
            "\n" +
            `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
            `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}\n`;

        for (const field of this.extraFields) {
            if (data[field.key]) text += `❖ ${formatter.bold(field.label)}: ${data[field.key]}\n`;
        }

        return text.trim();
    }

    defaultFormatAnswer(answer) {
        return tools.msg.ucwords(answer);
    }

    async handle(ctx) {
        const sessionKey = `${ctx.id}_${this.name}`;

        if (sessions.has(sessionKey)) return await ctx.reply(tools.msg.info("Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("siputzx", this.apiEndpoint);
            const response = await axios.get(apiUrl);
            const data = response.data.data || response.data;

            const game = {
                coin: this.coinReward,
                timeout: this.timeout,
                answer: data[this.answerKey]?.toLowerCase() || ""
            };

            if (!game.answer) throw new Error("Data jawaban tidak ditemukan!");

            sessions.set(sessionKey, true);

            const messageContent = {
                text: this.formatQuestion(data),
                buttons: [{
                    text: `Petunjuk (-${this.hintCost} koin)`,
                    id: `hint_${ctx.used.command}`
                }, {
                    text: "Menyerah",
                    id: `surrender_${ctx.used.command}`
                }]
            };

            if (this.imageKey && data[this.imageKey]) {
                await ctx.reply({
                    image: {
                        url: data[this.imageKey]
                    },
                    caption: messageContent.text,
                    buttons: messageContent.buttons
                });
            } else if (this.audioKey && data[this.audioKey]) {
                await ctx.reply({
                    audio: {
                        url: data[this.audioKey]
                    }
                });
                await ctx.reply(messageContent);
            } else {
                await ctx.reply(messageContent);
            }

            const collector = ctx.MessageCollector({
                time: game.timeout
            });
            const playAgain = [{
                text: "Main Lagi",
                id: ctx.used.prefix + ctx.used.command
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.body?.toLowerCase();
                const participantDb = collCtx.db.user;
                const isParticipantUnlimited = collCtx.sender.isOwner() || participantDb?.premium;

                if (participantAnswer === `hint_${ctx.used.command}`) {
                    if (!isParticipantUnlimited && participantDb.coin < this.hintCost) return await collCtx.reply(tools.msg.info(config.msg.coin));
                    if (!isParticipantUnlimited) {
                        participantDb.coin -= this.hintCost;
                        participantDb.save();
                    }
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await collCtx.reply(formatter.monospace(clue.toUpperCase()));
                    return;
                }

                if (participantAnswer === `surrender_${ctx.used.command}`) {
                    sessions.delete(sessionKey);
                    collector.stop();
                    const formattedAnswer = this.formatAnswer(game.answer);
                    await collCtx.reply({
                        text: tools.msg.info(`Anda menyerah! Jawaban: ${formattedAnswer}.`),
                        buttons: playAgain
                    });
                    return;
                }

                if (participantAnswer === game.answer) {
                    sessions.delete(sessionKey);
                    collector.stop();
                    if (!isParticipantUnlimited) participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    participantDb.save();
                    await collCtx.reply({
                        text: tools.msg.info(`Benar! +${game.coin} Koin`),
                        buttons: playAgain
                    });
                } else if (this._isCloseMatch(participantAnswer, game.answer)) {
                    await collCtx.reply(tools.msg.info("Sedikit lagi!"));
                }
            });

            collector.on("end", async () => {
                if (sessions.has(sessionKey)) {
                    sessions.delete(sessionKey);
                    const formattedAnswer = this.formatAnswer(game.answer);
                    await ctx.reply({
                        text: tools.msg.info(`Waktu habis! Jawaban: ${formattedAnswer}.`),
                        buttons: playAgain
                    });
                }
            });

        } catch (error) {
            sessions.delete(sessionKey);
            await tools.cmd.handleError(ctx, error, true);
        }
    }

    _isCloseMatch(input, answer) {
        if (!input || !answer) return false;
        const similarity = tools.cmd.didYouMean(input, [answer]);
        return similarity === answer;
    }
}

const gameConfigs = {
    asahotak: new TebakGame({
        name: "asahotak",
        apiEndpoint: "/api/games/asahotak",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    caklontong: new TebakGame({
        name: "caklontong",
        apiEndpoint: "/api/games/caklontong",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        extraFields: [{
            key: "deskripsi",
            label: "Deskripsi"
        }],
        formatAnswer(data) {
            const answer = data[this.answerKey] || "";
            const description = data.deskripsi || "";
            return `${tools.msg.ucwords(answer)} (${description})`;
        }
    }),

    lengkapikalimat: new TebakGame({
        name: "lengkapikalimat",
        apiEndpoint: "/api/games/lengkapikalimat",
        answerKey: "jawaban",
        questionKey: "pertanyaan",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    siapakahaku: new TebakGame({
        name: "siapakahaku",
        apiEndpoint: "/api/games/siapakahaku",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    susunkata: new TebakGame({
        name: "susunkata",
        apiEndpoint: "/api/games/susunkata",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        extraFields: [{
            key: "tipe",
            label: "Tipe"
        }]
    }),

    tebakbendera: new TebakGame({
        name: "tebakbendera",
        apiEndpoint: "/api/games/tebakbendera",
        answerKey: "name",
        questionKey: null,
        imageKey: "img",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Bendera negara apa ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakgame: new TebakGame({
        name: "tebakgame",
        apiEndpoint: "/api/games/tebakgame",
        answerKey: "jawaban",
        questionKey: null,
        imageKey: "img",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Game apa ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakgambar: new TebakGame({
        name: "tebakgambar",
        apiEndpoint: "/api/games/tebakgambar",
        answerKey: "jawaban",
        questionKey: "deskripsi",
        imageKey: "img",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebakhewan: new TebakGame({
        name: "tebakhewan",
        apiEndpoint: "/api/games/tebakhewan",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebakheroml: new TebakGame({
        name: "tebakheroml",
        apiEndpoint: "/api/games/tebakheroml",
        answerKey: "name",
        questionKey: null,
        audioKey: "lagu",
        coinReward: 7,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Dengarkan suara hero Mobile Legends ini!\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakjkt: new TebakGame({
        name: "tebakjkt",
        apiEndpoint: "/api/games/tebakjkt",
        answerKey: "jawaban",
        questionKey: null,
        imageKey: "gambar",
        coinReward: 7,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Siapa member JKT48 ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakkalimat: new TebakGame({
        name: "tebakkalimat",
        apiEndpoint: "/api/games/tebakkalimat",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebakkarakterff: new TebakGame({
        name: "tebakkarakterff",
        apiEndpoint: "/api/games/karakter-freefire",
        answerKey: "name",
        questionKey: null,
        imageKey: "gambar",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Siapa karakter Free Fire ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakkartun: new TebakGame({
        name: "tebakkartun",
        apiEndpoint: "/api/games/tebakkartun",
        answerKey: "name",
        questionKey: null,
        imageKey: "img",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Kartun apa ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebakkata: new TebakGame({
        name: "tebakkata",
        apiEndpoint: "/api/games/tebakkata",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebakkimia: new TebakGame({
        name: "tebakkimia",
        apiEndpoint: "/api/games/tebakkimia",
        answerKey: "unsur",
        questionKey: null,
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Lambang ${data.lambang} adalah unsur apa?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebaklagu: new TebakGame({
        name: "tebaklagu",
        apiEndpoint: "/api/games/tebaklagu",
        answerKey: "judul",
        questionKey: null,
        audioKey: "lagu",
        coinReward: 7,
        hintCost: 3,
        timeout: 60000,
        extraFields: [{
            key: "artis",
            label: "Artis"
        }],
        formatQuestion(data) {
            let text = `✦ — Dengarkan audio berikut dan tebak judul lagunya!\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}\n`;

            if (data.artis) text += `❖ ${formatter.bold("Petunjuk")}: Artis: ${data.artis}`;
            return text.trim();
        }
    }),

    tebaklirik: new TebakGame({
        name: "tebaklirik",
        apiEndpoint: "/api/games/tebaklirik",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebaklogo: new TebakGame({
        name: "tebaklogo",
        apiEndpoint: "/api/games/tebaklogo",
        answerKey: "jawaban",
        questionKey: null,
        imageKey: "image",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            const d = data.data || data;
            return `✦ — Logo apa ini?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tebaktebakan: new TebakGame({
        name: "tebaktebakan",
        apiEndpoint: "/api/games/tebaktebakan",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    }),

    tebakwarna: new TebakGame({
        name: "tebakwarna",
        apiEndpoint: "/api/games/tebakwarna",
        answerKey: "correct",
        questionKey: null,
        imageKey: "image",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000,
        formatQuestion(data) {
            return `✦ — Angka berapa yang terlihat?\n` +
                "\n" +
                `❖ ${formatter.bold("Bonus")}: ${this.coinReward} Koin\n` +
                `❖ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(this.timeout)}`;
        }
    }),

    tekateki: new TebakGame({
        name: "tekateki",
        apiEndpoint: "/api/games/tekateki",
        answerKey: "jawaban",
        questionKey: "soal",
        coinReward: 5,
        hintCost: 3,
        timeout: 60000
    })
};

const handlers = {};
for (const [name, game] of Object.entries(gameConfigs)) {
    handlers[name] = async (ctx) => await game.handle(ctx);
}

module.exports = [{
    name: "asahotak",
    category: "game",
    code: handlers.asahotak
}, {
    name: "caklontong",
    category: "game",
    code: handlers.caklontong
}, {
    name: "lengkapikalimat",
    category: "game",
    code: handlers.lengkapikalimat
}, {
    name: "siapakahaku",
    category: "game",
    code: handlers.siapakahaku
}, {
    name: "susunkata",
    category: "game",
    code: handlers.susunkata
}, {
    name: "tebakbendera",
    category: "game",
    code: handlers.tebakbendera
}, {
    name: "tebakgame",
    category: "game",
    code: handlers.tebakgame
}, {
    name: "tebakgambar",
    category: "game",
    code: handlers.tebakgambar
}, {
    name: "tebakhewan",
    category: "game",
    code: handlers.tebakhewan
}, {
    name: "tebakheroml",
    aliases: ["tebakml"],
    category: "game",
    code: handlers.tebakheroml
}, {
    name: "tebakjkt",
    category: "game",
    code: handlers.tebakjkt
}, {
    name: "tebakkalimat",
    category: "game",
    code: handlers.tebakkalimat
}, {
    name: "tebakkarakterff",
    aliases: ["tebakff"],
    category: "game",
    code: handlers.tebakkarakterff
}, {
    name: "tebakkartun",
    category: "game",
    code: handlers.tebakkartun
}, {
    name: "tebakkata",
    category: "game",
    code: handlers.tebakkata
}, {
    name: "tebakkimia",
    category: "game",
    code: handlers.tebakkimia
}, {
    name: "tebaklagu",
    category: "game",
    code: handlers.tebaklagu
}, {
    name: "tebaklirik",
    category: "game",
    code: handlers.tebaklirik
}, {
    name: "tebaklogo",
    category: "game",
    code: handlers.tebaklogo
}, {
    name: "tebaktebakan",
    category: "game",
    code: handlers.tebaktebakan
}, {
    name: "tebakwarna",
    category: "game",
    code: handlers.tebakwarna
}, {
    name: "tekateki",
    category: "game",
    code: handlers.tekateki
}];