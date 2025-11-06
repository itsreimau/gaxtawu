// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, Gktw } = require("@itsreimau/gktw");
const axios = require("axios");
const moment = require("moment-timezone");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(ctxBot, m, type, isSimulate = false) {
    const groupJid = m.id;
    const groupDb = ctxBot.getDb("groups", groupJid);
    const botDb = ctxBot.getDb("bot", Baileys.jidNormalizedUser(ctxBot.core.user.lid));

    if (!isSimulate && groupDb?.mutebot) return;
    if (!isSimulate && !groupDb?.option?.welcome) return;
    if (!isSimulate && ["private", "self"].includes(botDb?.mode)) return;

    const now = moment().tz(config.system.timeZone);
    const hour = now.hour();
    if (!isSimulate && hour >= 0 && hour < 6) return;

    for (const jid of m.participants) {
        const isWelcome = type === Events.UserJoin;
        const tag = `@${ctxBot.getId(jid)}`;
        const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
        const metadata = await ctxBot.core.groupMetadata(groupJid);
        const text = customText ?
            customText.replace(/%tag%/g, tag).replace(/%subject%/g, metadata.subject).replace(/%description%/g, metadata.description) :
            (isWelcome ?
                `>ᴗ< ${formatter.italic(`Selamat datang ${tag} di grup ${metadata.subject}!`)}` :
                `•︵• ${formatter.italic(`Selamat tinggal, ${tag}!`)}`);
        const profilePictureUrl = await ctxBot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

        await ctxBot.core.sendMessage(groupJid, {
            text,
            contextInfo: {
                mentionedJid: [jid],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.bot.newsletterJid,
                    newsletterName: config.bot.name
                },
                externalAdReply: {
                    title: config.bot.name,
                    body: `v${require("../package.json").version}`,
                    thumbnailUrl: profilePictureUrl,
                    sourceUrl: config.bot.groupLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: tools.cmd.fakeQuotedText(config.msg.footer)
        });

        if (isWelcome && groupDb?.text?.intro) await ctxBot.core.sendMessage(groupJid, {
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
        } else {
            await ctx.reply(`ⓘ ${formatter.italic(`${config.msg.botAdmin} Tidak dapat mengeluarkan Anda yang telah mencapai ${maxWarnings} warning.`)}`);
        }
    }

    groupDb.save();
}

// Events utama bot
module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Tetapkan max listeners untuk events

    // Event saat bot siap
    bot.ev.once(Events.ClientReady, async (m) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${m.user.id}`);

        // Mulai ulang bot
        const botDb = bot.getDb("bot", Baileys.jidNormalizedUser(bot.core.user.lid));
        const botRestart = botDb?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: `ⓘ ${formatter.italic(`Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`)}`,
                edit: botRestart.key
            });
            delete botDb.restart;
            botDb.save();
        }

        // Tetapkan config pada bot
        config.bot.groupLink = `https://chat.whatsapp.com/${await bot.core.groupInviteCode(config.bot.groupJid).then(code => code).catch(() => "FxEYZl2UyzAEI2yhaH34Ye")}`;
    });

    // Event saat bot menerima pesan
    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        if (m.key.fromMe) return;

        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();

        // Grup atau obrolan pribadi
        if (isGroup || isPrivate) {
            // Variabel umum
            const senderJid = ctx.sender.jid;
            const senderId = ctx.getId(senderJid);
            const senderLid = Baileys.isJidUser(senderJid) ? await ctx.getLidUser(senderJid) : senderJid;
            const groupJid = isGroup ? ctx.id : null;
            const groupId = isGroup ? ctx.getId(groupJid) : null;
            const isOwner = ctx.citation.isOwner;
            const isCmd = tools.cmd.isCmd(m.content, ctx.bot);
            const isAdmin = isGroup ? await ctx.group().isSenderAdmin() : false;

            // Mengambil database
            const botDb = ctx.db.bot;
            const senderDb = ctx.db.user;
            const groupDb = ctx.db.group;

            // Penanganan database pengguna
            if (senderDb) {
                if (!senderDb?.username) senderDb.username = `@user_${tools.cmd.generateUID(senderId, false)}`;
                if (!senderDb?.uid || senderDb?.uid !== tools.cmd.generateUID(senderId)) senderDb.uid = tools.cmd.generateUID(senderId);
                if (senderDb?.premium && Date.now() > senderDb.premiumExpiration) {
                    delete senderDb.premium;
                    delete senderDb.premiumExpiration;
                }
                if (isOwner || senderDb?.premium) senderDb.coin = 0;
                if (!senderDb?.coin || !Number.isFinite(senderDb.coin)) senderDb.coin = 100;
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
            if (muteList.includes(senderLid)) await ctx.deleteMessage(m.key);

            // Pengecekan untuk tidak tersedia pada malam hari
            const now = moment().tz(config.system.timeZone);
            const hour = now.hour();
            if (hour >= 0 && hour < 6 && !isOwner && !senderDb?.premium) return;

            // Penanganan bug hama!
            const analyze = Gktw.analyzeBug(m.message);
            if (analyze.isMalicious && !isOwner) {
                await ctx.deleteMessage(m.key);
                await ctx.block(senderJid);
                senderDb.banned = true;
                senderDb.save();

                await ctx.core.sendMessage(config.owner.id + Baileys.S_WHATSAPP_NET, {
                    text: `ⓘ ${formatter.italic(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode(analyze.reason)}.`)}`,
                    mentions: [senderJid]
                });
            }

            // Did you mean?
            if (isCmd?.didyoumean) await ctx.reply({
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
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`); // Log pesan masuk

                // Variabel umum
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
                            const checkMedia = tools.cmd.checkMedia(ctx.getMessageType(), type);
                            if (!!checkMedia) {
                                await ctx.reply(`ⓘ ${formatter.italic(`Jangan kirim ${type}!`)}`);
                                await ctx.deleteMessage(m.key);
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
                        if (m.content && tools.cmd.isUrl(m.content)) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan kirim link!")}`);
                            await ctx.deleteMessage(m.key);
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
                            await ctx.deleteMessage(m.key);
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
                        const checkMedia = tools.cmd.checkMedia(ctx.getMessageType(), "groupStatusMentionMessage");
                        if (!!checkMedia) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan tag grup di SW, gak ada yg peduli!")}`);
                            await ctx.deleteMessage(m.key);
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
                        if (m.content && toxicRegex.test(m.content)) {
                            await ctx.reply(`ⓘ ${formatter.italic("Jangan toxic!")}`);
                            await ctx.deleteMessage(m.key);
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
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from: ${senderId}`); // Log pesan masuk

                // Apa yaa...
            }
        }
    });

    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (calls) => {
        if (!config.system.antiCall) return;

        for (const call of calls) {
            const callId = call.id;
            const senderJid = call.from;
            const senderId = bot.getId(senderJid);
            const isOwner = bot.checkCitation(senderJid, "owner");

            if (Baileys.isJidGroup(callId) || isOwner) return;

            consolefy.info(`Incoming call from: ${senderId}`); // Log panggilan masuk

            await bot.core.rejectCall(callId, senderJid);
            const senderDb = bot.getDb("users", senderJid);
            senderDb.banned = true;
            senderDb.save();

            await bot.core.sendMessage(config.owner.id + Baileys.S_WHATSAPP_NET, {
                text: `ⓘ ${formatter.italic(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`)}`,
                mentions: [senderJid]
            });
            await bot.core.sendMessage(senderJid, {
                text: `ⓘ ${formatter.italic("Anda telah dibanned secara otomatis karena melanggar aturan!")}`,
                buttons: [{
                    buttonId: `/owner`,
                    buttonText: {
                        displayText: "Hubungi Owner"
                    }
                }]
            });
        }
    });

    // Event saat pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (m) => handleWelcome(bot, m, Events.UserJoin));
    bot.ev.on(Events.UserLeave, async (m) => handleWelcome(bot, m, Events.UserLeave));
};
module.exports.handleWelcome = handleWelcome; // Penanganan event pengguna bergabung/keluar grup