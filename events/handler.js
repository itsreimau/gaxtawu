// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, Gktw } = require("@itsreimau/gktw");
const axios = require("axios");
const moment = require("moment-timezone");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(ctxBot, ctx, type, isSimulate = false) {
    const groupJid = ctx.id;
    const groupDb = ctxBot.getDb("groups", groupJid);
    const jid = ctx.participant;

    if (!isSimulate && groupDb?.mutebot) return;
    if (!isSimulate && !groupDb?.option?.welcome) return;
    if (!isSimulate && ["private", "self"].includes(config.system?.mode)) return;

    const now = moment().tz(config.system.timeZone);
    const hour = now.hour();
    if (config.system.unavailableAtNight && !isSimulate && hour >= 0 && hour < 6) return;

    const isWelcome = type === Events.UserJoin;
    const tag = `@${ctxBot.getId(jid)}`;
    const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
    const metadata = await ctxBot.core.groupMetadata(groupJid);
    const text = customText ? customText.replace(/%tag%/g, tag).replace(/%subject%/g, metadata.subject).replace(/%description%/g, metadata.description) :
        (isWelcome ?
            `>ᴗ< ${formatter.italic(`Selamat datang ${tag} di grup ${metadata.subject}!`)}` :
            `•︵• ${formatter.italic(`Selamat tinggal, ${tag}!`)}`
        );
    const profilePictureUrl = await ctxBot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

    await ctxBot.core.sendMessage(groupJid, {
        text,
        contextInfo: {
            mentionedJid: [jid],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.bot.newsletterJid,
                newsletterName: config.msg.footer
            },
            externalAdReply: {
                title: config.bot.name,
                body: config.msg.note,
                mediaType: 1,
                thumbnailUrl: profilePictureUrl,
                sourceUrl: config.bot.groupLink,
                renderLargerThumbnail: true
            }
        }
    }, {
        quoted: tools.cmd.fakeQuotedText(config.msg.footer)
    });

    if (isWelcome && groupDb?.text?.intro)
        await ctxBot.core.sendMessage(groupJid, {
            text: groupDb.text.intro,
            mentions: [jid],
            interactiveButtons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Salin Teks",
                    id: "copy_text",
                    copy_code: text
                })
            }]
        }, {
            quoted: tools.cmd.fakeQuotedText(">ᴗ< Jangan lupa untuk mengisi intro!")
        });
}

// Fungsi untuk menambahkan warning
async function addWarning(ctx, senderJid, senderLid, isAdmin, groupDb) {
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
        text: `ⓘ ${formatter.italic(`Warning ${currentWarnings}/${maxWarnings} untuk @${ctx.getId(senderJid)}!`)}`,
        mentions: [senderJid]
    });

    if (currentWarnings >= maxWarnings) {
        if (isAdmin) {
            await ctx.reply(`ⓘ ${formatter.italic(`Anda telah menerima ${maxWarnings} warning dan akan dikeluarkan dari grup!`)}`);
            if (!config.system.restrict) await ctx.group().kick(senderLid);
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
        const botRestart = config?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: `ⓘ ${formatter.italic(`Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`)}`,
                edit: botRestart.key
            });
            delete config.restart;
            config.save();
        }

        // Tetapkan config pada bot
        if (!config.bot.groupLink) config.bot.groupLink = `https://chat.whatsapp.com/${await bot.core.groupInviteCode(config.bot.groupJid).catch(() => "FxEYZl2UyzAEI2yhaH34Ye")}`;
        config.save();
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
            const isCmd = tools.cmd.isCmd(msg.text, ctx.bot);
            const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

            // Mengambil database
            const senderDb = ctx.db.user;
            const groupDb = ctx.db.group;

            // Pengecekan mode bot (premium, group, private, self)
            if (config.system?.mode === "premium" && !isOwner && !senderDb?.premium) return;
            if (config.system?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
            if (config.system?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
            if (config.system?.mode === "self" && !isOwner) return;

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
            const analyze = Gktw.analyzeBug(msg.message);
            if (analyze.isMalicious && !isOwner) {
                await ctx.deleteMessage(msg.key);
                await ctx.block(senderJid);
                senderDb.banned = true;
                senderDb.save();

                const reportOwner = tools.cmd.getReportOwner();
                if (reportOwner && reportOwner.length > 0) {
                    for (const ownerId of reportOwner) {
                        await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                            text: `ⓘ ${formatter.italic(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode(`Anti Bug - ${analyze.reason}`)}.`)}`,
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
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from group: ${groupId}, by: ${Baileys.isJidUser(senderJid) ? senderId : `${senderId} (LID)`}`); // Log pesan masuk

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
                    for (const type of ["audio", "document", "gif", "image", "sticker", "video"]) {
                        if (groupDb?.option?.[`anti${type}`]) {
                            const checkMedia = tools.cmd.checkMedia(messageType, type);
                            if (!!checkMedia) {
                                await ctx.reply(`ⓘ ${formatter.italic(`Jangan kirim ${type}!`)}`);
                                await ctx.deleteMessage(msg.key);
                                if (groupAutokick) {
                                    await ctx.group().kick(senderJid);
                                } else {
                                    await addWarning(ctx, senderJid, senderLid, isAdmin, groupDb);
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
                                await addWarning(ctx, senderJid, senderLid, isAdmin, groupDb);
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
                                await addWarning(ctx, senderJid, senderLid, isAdmin, groupDb);
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
                                await addWarning(ctx, senderJid, senderLid, isAdmin, groupDb);
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
                                await addWarning(ctx, senderJid, senderLid, isAdmin, groupDb);
                            }
                        }
                    }
                }
            }

            // Penanganan obrolan pribadi
            if (isPrivate) {
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from: ${Baileys.isJidUser(senderJid) ? senderId : `${senderId} (LID)`}`); // Log pesan masuk

                // Apa yaa...
            }
        }
    });

    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (ctx) => {
        if (!config.system.antiCall) return;

        const callId = ctx.id;
        const senderJid = ctx.from;
        const senderId = bot.getId(senderJid);
        const isOwner = bot.checkOwner(senderJid);

        if (Baileys.isJidGroup(callId) || isOwner) return;

        consolefy.info(`Incoming call from: ${Baileys.isJidUser(senderJid) ? senderId : `${senderId} (LID)`}`); // Log panggilan masuk

        await bot.core.rejectCall(callId, senderJid);
        const senderDb = bot.getDb("users", senderJid);
        senderDb.banned = true;
        senderDb.save();

        const reportOwner = tools.cmd.getReportOwner();
        if (reportOwner && reportOwner.length > 0) {
            for (const ownerId of reportOwner) {
                await bot.core.sendMessage(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: `ⓘ ${formatter.italic(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`)}`,
                    mentions: [senderJid]
                });
                await tools.cmd.delay(500);
            }
        }
        await bot.core.sendMessage(senderJid, {
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