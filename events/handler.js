// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, Gktw, MessageType } = require("@itsreimau/gktw");
const axios = require("axios");
const moment = require("moment-timezone");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(botCtx, ctx, type, isSimulate = false) {
    const groupJid = ctx.id;
    const groupDb = botCtx.getDb("groups", groupJid);
    const botDb = botCtx.getDb("bot");
    const participantJid = ctx.participant;

    if (!isSimulate && groupDb?.mutebot) return;
    if (!isSimulate && !groupDb?.option?.welcome) return;
    if (!isSimulate && ["private", "self"].includes(botDb?.mode)) return;

    const now = moment().tz(config.system.timeZone);
    const hour = now.hour();
    if (!isSimulate && config.system.unavailableAtNight && hour >= 0 && hour < 6) return;

    const isWelcome = type === Events.UserJoin;
    const tag = `@${botCtx.getId(participantJid)}`;
    const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
    const metadata = await botCtx.core.groupMetadata(groupJid);
    const text = customText ? customText.replace(/%tag%/g, tag).replace(/%subject%/g, metadata.subject).replace(/%description%/g, metadata.description) :
        (isWelcome ?
            `>ᴗ< ${formatter.italic(`Selamat datang ${tag} di grup ${metadata.subject}!`)}` :
            `•︵• ${formatter.italic(`Selamat tinggal, ${tag}!`)}`
        );
    const profilePictureUrl = await botCtx.core.profilePictureUrl(participantJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
    const canvasUrl = tools.api.createUrl("deline", "/canvas/welcome", {
        username: botCtx.getPushName(participantJid) || "User",
        guildName: metadata.subject.length > 30 ? `${metadata.subject.substring(0, 27)}...` : metadata.subject,
        memberCount: metadata.participants.length,
        avatar: profilePictureUrl,
        background: "https://picsum.photos/1024/450.jpg",
        quality: "99"
    });

    await botCtx.core.sendMessage(groupJid, {
        image: {
            url: canvasUrl
        },
        mimetype: tools.mime.lookup("png"),
        caption: text,
        mentions: [participantJid]
    });

    if (isWelcome && groupDb?.text?.intro)
        await botCtx.core.sendMessage(groupJid, {
            text: groupDb.text.intro,
            mentions: [participantJid],
            interactiveButtons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Salin Teks",
                    copy_code: text
                })
            }]
        });
}

// Fungsi untuk menambahkan warning
async function handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb) {
    const maxWarnings = groupDb?.maxwarnings || 3;
    const warnings = groupDb?.warnings || [];

    const senderWarning = warnings.find(warning => warning.jid === senderLid);
    let currentWarnings = senderWarning ? senderWarning.count : 0;
    currentWarnings += 1;
    if (senderWarning) {
        senderWarning.count = currentWarnings;
    } else {
        warnings.push({
            jid: senderLid,
            count: currentWarnings
        });
    }
    groupDb.warnings = warnings;

    await ctx.reply({
        text: `ⓘ ${formatter.italic(`Warning ${currentWarnings}/${maxWarnings} untuk @${ctx.getId(senderId)}!`)}`,
        mentions: [senderJid]
    });

    if (currentWarnings >= maxWarnings) {
        if (isAdmin) {
            await ctx.reply(`ⓘ ${formatter.italic(`Anda telah menerima ${maxWarnings} warning dan akan dikeluarkan dari grup!`)}`);
            if (!config.system.restrict) await ctx.group().kick(senderJid);
            groupDb.warnings = warnings.filter(warning => warning.jid !== senderLid);
        } else if (!isAdmin) {
            await ctx.reply(`ⓘ ${formatter.italic(`${config.msg.botAdmin} Tidak dapat mengeluarkan Anda yang telah mencapai ${maxWarnings} warning.`)}`);
        }
    }

    groupDb.save();
}

// Events utama bot
module.exports = bot => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Tetapkan max listeners untuk events

    // Event saat bot siap
    bot.ev.once(Events.ClientReady, async (ctx) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${ctx.user.id}`);

        // Mulai ulang bot
        const botRestart = bot.getDb("bot")?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: `ⓘ ${formatter.italic(`Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`)}`,
                edit: botRestart.key
            });
            delete botRestart.restart;
            botRestart.save();
        }

        // Tetapkan config pada bot
        const groupLink = `https://chat.whatsapp.com/${await bot.core.groupInviteCode(config.bot.groupJid).catch(() => "FxEYZl2UyzAEI2yhaH34Ye")}`;
        if (!config.bot.groupLink || (config.bot.groupLink !== groupLink)) config.core.set("bot.groupLink", groupLink);
    });

    // Event saat bot menerima pesan
    bot.ev.on(Events.MessagesUpsert, async (ctx) => {
        const {
            msg
        } = ctx;
        if (msg.key.fromMe) return;

        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();

        // Grup atau obrolan pribadi
        if (isGroup || isPrivate) {
            // Variabel umum
            const senderJid = ctx.sender.jid;
            const senderId = ctx.getId(senderJid);
            const senderLid = ctx.sender.lid;
            const groupJid = isGroup ? ctx.id : null;
            const groupId = isGroup ? ctx.getId(groupJid) : null;
            const isOwner = ctx.sender.isOwner();
            const isCmd = ctx.isCmd();
            const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

            // Mengambil database
            const botDb = ctx.db.bot;
            const senderDb = ctx.db.user;
            const groupDb = ctx.db.group;

            // Penanganan database pengguna
            if (senderDb) {
                const senderUid = [tools.cmd.generateUID(senderId), tools.cmd.generateUID(senderId, false)];
                if (!senderDb?.uid || senderDb?.uid !== senderUid[0]) senderDb.uid = senderUid[0];
                if (!senderDb?.username) senderDb.username = `@user_${senderUid[1]}`;
                if (senderDb?.premium && Date.now() > senderDb?.premiumExpiration) {
                    delete senderDb.premium;
                    delete senderDb.premiumExpiration;
                }
                if (isOwner || senderDb?.premium) senderDb.coin = 0;
                if (!senderDb?.coin || !Number.isFinite(senderDb?.coin)) senderDb.coin = 100;
                senderDb.save();
            }

            // Pengecekan mode bot (premium, group, private, self)
            if (botDb?.mode === "premium" && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "self" && !isOwner) return;

            // Pengecekan mute pada grup
            if (groupDb?.mutebot === true && !isOwner && !isAdmin) return;
            if (groupDb?.mutebot === "owner" && !isOwner) return;
            const muteList = groupDb?.mute || [];
            if (muteList.includes(senderLid)) await ctx.deleteMessage(msg.key);

            // Pengecekan untuk tidak tersedia pada malam hari
            const now = moment().tz(config.system.timeZone);
            const hour = now.hour();
            if (config.system.unavailableAtNight && !isOwner && !senderDb?.premium && hour >= 0 && hour < 6) return;

            // Penanganan bug hama!
            const analyze = Gktw.analyzeBug(msg.message, {
                maxTextLength: 10000,
                maxMentions: 1000,
                maxFileLength: 2 * 1024 * 1024 * 1024,
                maxPageCount: 10000,
                maxCharacterFlood: 20000
            });
            if (config.system.antiBug && analyze.isMalicious && !senderDb?.banned && !isOwner) {
                await ctx.deleteMessage(msg.key);
                await ctx.block(senderJid);
                senderDb.banned = true;
                senderDb.save();

                const reportOwner = tools.cmd.getReportOwner();
                if (reportOwner && reportOwner.length > 0) {
                    for (const ownerId of reportOwner) {
                        await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                            text: `ⓘ ${formatter.italic(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode(`Anti Bug - ${analyze.reason}`)}, tingkat bahaya ${formatter.inlineCode(analyze.severity)}, jenis ancaman ${formatter.inlineCode(analyze.severity)}.`)}`,
                            mentions: [senderJid]
                        });
                        await tools.cmd.delay(500);
                    }
                }
            }

            // Did you mean?
            if (isCmd?.didyoumean)
                await ctx.reply({
                    text: `ⓘ ${formatter.italic(`Apakah maksudmu ${formatter.inlineCode(isCmd.prefix + isCmd.didyoumean)}?`)}`,
                    buttons: [{
                        buttonId: `${isCmd.prefix + isCmd.didyoumean} ${isCmd.input}`,
                        buttonText: {
                            displayText: "Ya, benar!"
                        }
                    }]
                });

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const senderAfk = senderDb?.afk || {};
            if (senderAfk.reason || senderAfk.timestamp) {
                const timeElapsed = Date.now() - senderAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(`ⓘ ${formatter.italic(`Anda telah keluar dari AFK ${senderAfk.reason ? `dengan alasan ${formatter.inlineCode(senderAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`)}`);
                    delete senderDb.afk;
                    senderDb.save();
                }
            }

            // Penanganan obrolan grup
            if (isGroup) {
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from group: ${groupId}, by: ${Baileys.isPnUser(senderJid) ? senderId : `${senderId} (LID)`}`); // Log pesan masuk

                // Variabel umum
                const messageType = ctx.getMessageType();
                const groupAutokick = groupDb?.option?.autokick;

                // Penanganan database grup
                if (groupDb?.sewa && Date.now() > senderDb?.sewaExpiration) {
                    delete groupDb.sewa;
                    delete groupDb.sewaExpiration;
                    groupDb.save();
                }

                // Penanganan AFK (Pengguna yang disebutkan atau di-balas/quote)
                const afkMentions = ctx.quoted ? [ctx.getId(ctx.quoted.sender)] : ctx.getMentioned().map(jid => ctx.getId(jid));
                if (afkMentions.length > 0) {
                    for (const afkMention of afkMentions) {
                        const mentionAfk = ctx.getDb("users", afkMention)?.afk || {};
                        if (mentionAfk.reason || mentionAfk.timestamp) {
                            const timeago = tools.msg.convertMsToDuration(Date.now() - mentionAfk.timestamp);
                            await ctx.reply(`ⓘ ${formatter.italic(`Jangan tag! Dia sedang AFK ${mentionAfk.reason ? `dengan alasan ${formatter.inlineCode(mentionAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`)}`);
                        }
                    }
                }

                if (!isCmd && !isOwner && !isAdmin) {
                    // Penanganan antimedia
                    for (const type of ["audio", "document", "image", "sticker", "video"]) {
                        if (groupDb?.option?.[`anti${type}`]) {
                            const checkMedia = tools.cmd.checkMedia(messageType, type);
                            if (!!checkMedia) {
                                await ctx.reply(`ⓘ ${formatter.italic(`Jangan kirim ${type}!`)}`);
                                await ctx.deleteMessage(msg.key);
                                if (groupAutokick) {
                                    await ctx.group().kick(senderJid);
                                } else {
                                    await handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb);
                                }
                            }
                        }
                    }

                    // Penanganan antilink
                    if (groupDb?.option?.antilink) {
                        if (msg.text && tools.cmd.isUrl(msg.text)) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan kirim link!")}`);
                            await ctx.deleteMessage(msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb);
                            }
                        }
                    }

                    // Penanganan antispam
                    if (groupDb?.option?.antispam) {
                        const now = Date.now();
                        const spamData = groupDb?.spam || [];
                        const senderSpam = spamData.find(spam => spam.jid === senderLid) || {
                            jid: senderLid,
                            count: 0,
                            lastMessageTime: 0
                        };

                        const timeDiff = now - senderSpam.lastMessageTime;
                        const newCount = timeDiff < 5000 ? senderSpam.count + 1 : 1;

                        senderSpam.count = newCount;
                        senderSpam.lastMessageTime = now;
                        if (!spamData.some(spam => spam.jid === senderLid)) spamData.push(senderSpam);
                        groupDb.spam = spamData;

                        if (newCount > 5) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan spam, ngelag woy!")}`);
                            await ctx.deleteMessage(msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb);
                            }
                            groupDb.spam = spamData.filter(spam => spam.jid !== senderLid);
                        }

                        groupDb.save();
                    }

                    // Penanganan antitagsw
                    if (groupDb?.option?.antitagsw) {
                        const checkMedia = msg.message?.protocolMessage?.type === 25;
                        if (!!checkMedia) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan tag grup di SW, gak ada yg peduli!")}`);
                            await ctx.deleteMessage(msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb);
                            }
                        }
                    }

                    // Penanganan antitoxic
                    if (groupDb?.option?.antitoxic) {
                        const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                        if (msg.text && toxicRegex.test(msg.text)) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan toxic!")}`);
                            await ctx.deleteMessage(msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, isAdmin, groupDb);
                            }
                        }
                    }
                }
            }

            // Penanganan obrolan pribadi
            if (isPrivate) {
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from: ${Baileys.isPnUser(senderJid) ? senderId : `${senderId} (LID)`}`); // Log pesan masuk

                // Apa yaa...
            }
        }
    });

    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (ctx) => {
        if (!config.system.antiCall) return;

        const callJid = ctx.id;
        const fromJid = ctx.from;
        const fromId = bot.getId(fromJid);
        const isOwner = bot.checkOwner(fromJid);
        const fromDb = bot.getDb("users", fromJid);

        if (Baileys.isJidGroup(callJid) || isOwner || fromDb?.banned) return;

        consolefy.info(`Incoming call from: ${Baileys.isPnUser(fromJid) ? fromId : `${fromId} (LID)`}`); // Log panggilan masuk

        await bot.core.rejectCall(callJid, fromJid);

        fromDb.banned = true;
        fromDb.save();

        const reportOwner = tools.cmd.getReportOwner();
        if (reportOwner && reportOwner.length > 0) {
            for (const ownerId of reportOwner) {
                await bot.core.sendMessage(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: `ⓘ ${formatter.italic(`Akun @${fromId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`)}`,
                    mentions: [fromJid]
                });
                await tools.cmd.delay(500);
            }
        }
        await bot.core.sendMessage(fromJid, {
            text: `ⓘ ${formatter.italic("Anda telah dibanned secara otomatis karena melanggar aturan!")}`,
            buttons: [{
                buttonId: "/owner",
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }]
        });
    });

    // Event saat pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (ctx) => handleWelcome(bot, ctx, Events.UserJoin));
    bot.ev.on(Events.UserLeave, async (ctx) => handleWelcome(bot, ctx, Events.UserLeave));
};
module.exports.handleWelcome = handleWelcome; // Penanganan event pengguna bergabung/keluar grup