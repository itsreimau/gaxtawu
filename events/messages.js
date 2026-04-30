// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, Gktw } = require("@itsreimau/gktw");
const moment = require("moment-timezone");

// Fungsi untuk menambahkan warning
async function handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb) {
    const maxWarnings = groupDb?.maxwarnings || 3;
    const warnings = groupDb?.warnings || [];

    const senderWarning = warnings.find(warning => tools.cmd.areJidsSameUser(warning.jid, senderLid));
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
        text: tools.msg.info(`Warning ${currentWarnings}/${maxWarnings} untuk @${ctx.getId(senderId)}!`),
        mentions: [senderJid]
    });

    if (currentWarnings >= maxWarnings) {
        const isBotAdmin = await ctx.group(groupJid, !config.system.selfReply).isBotAdmin();
        if (isBotAdmin) {
            await ctx.reply(tools.msg.info(`Anda telah menerima ${maxWarnings} warning dan akan dikeluarkan dari grup!`));
            if (!config.system.restrict) await ctx.group().kick(senderJid);
            groupDb.warnings = warnings.filter(warning => warning.jid !== senderLid);
        } else if (!isBotAdmin) {
            await ctx.reply(tools.msg.info(`${config.msg.botAdmin} Tidak dapat mengeluarkan Anda yang telah mencapai ${maxWarnings} warning.`));
        }
    }

    groupDb.save();
}

module.exports = (bot) => {
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
            if (groupDb?.mutebot === "owner" && !isOwner) return;
            if (groupDb?.mutebot && !isOwner && !isAdmin) return;
            const muteList = groupDb?.mute || [];
            if (muteList.includes(senderLid)) await ctx.deleteMessage(ctx.id, msg.key);

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
                await ctx.deleteMessage(ctx.id, msg.key);
                await ctx.block(senderJid);
                senderDb.banned = true;
                senderDb.save();

                const reportOwner = tools.cmd.getReportOwner();
                if (reportOwner && reportOwner.length > 0) {
                    for (const ownerId of reportOwner) {
                        await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                            text: tools.msg.info(`Akun @${senderId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode(`Anti Bug - ${analyze.reason}`)}, tingkat bahaya ${formatter.inlineCode(analyze.severity)}, jenis ancaman ${formatter.inlineCode(analyze.severity)}.`),
                            mentions: [senderJid]
                        });
                        await tools.cmd.delay(500);
                    }
                }
            }

            // Did you mean?
            if (isCmd?.didyoumean)
                await ctx.reply({
                    text: tools.msg.info(`Apakah maksudmu ${formatter.inlineCode(isCmd.prefix + isCmd.didyoumean)}?`),
                    buttons: [{
                        text: "Ya, benar!",
                        id: `${isCmd.prefix + isCmd.didyoumean} ${isCmd.input}`
                    }]
                });

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const senderAfk = senderDb?.afk || {};
            if (senderAfk.reason || senderAfk.timestamp) {
                const timeElapsed = Date.now() - senderAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(tools.msg.info(`Anda telah keluar dari AFK ${senderAfk.reason ? `dengan alasan ${formatter.inlineCode(senderAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`));
                    delete senderDb.afk;
                    senderDb.save();
                }
            }

            // Penanganan obrolan grup
            if (isGroup) {
                if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`); // Log pesan masuk

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
                const afkMentions = ctx.quoted ? [ctx.quoted.sender] : await ctx.getMentioned();
                if (afkMentions.length > 0) {
                    for (const afkMention of afkMentions) {
                        const mentionAfk = ctx.getDb("users", afkMention)?.afk || {};
                        if (mentionAfk.reason || mentionAfk.timestamp) {
                            const timeago = tools.msg.convertMsToDuration(Date.now() - mentionAfk.timestamp);
                            await ctx.reply({
                                text: tools.msg.info(`Jangan ganggu! @${ctx.getId(afkMention)} sedang AFK ${mentionAfk.reason ? `dengan alasan ${formatter.inlineCode(mentionAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`),
                                mentions: [afkMention]
                            });
                        }
                    }
                }

                if (!isCmd && !isOwner && !isAdmin) {
                    // Penanganan antimedia
                    for (const type of ["audio", "document", "image", "sticker", "video"]) {
                        if (groupDb?.option?.[`anti${type}`]) {
                            const checkMedia = tools.cmd.checkMedia(messageType, type);
                            if (!!checkMedia) {
                                await ctx.reply(tools.msg.info(`Jangan kirim ${type}!`));
                                await ctx.deleteMessage(ctx.id, msg.key);
                                if (groupAutokick) {
                                    await ctx.group().kick(senderJid);
                                } else {
                                    await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                                }
                            }
                        }
                    }

                    // Penanganan antigcsw
                    if (groupDb?.option?.antigcsw) {
                        const checkMedia = msg.message?.groupStatusMessageV2?.contextInfo?.isGroupStatus;
                        if (checkMedia) {
                            await ctx.reply(tools.msg.info("Jangan bikin SW di grup, gak ada yg peduli!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                            }
                        }
                    }

                    // Penanganan antilink
                    if (groupDb?.option?.antilink) {
                        if (msg.body && tools.cmd.isUrl(msg.body)) {
                            await ctx.reply(tools.msg.info("Jangan kirim link!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                            }
                        }
                    }

                    // Penanganan antispam
                    if (groupDb?.option?.antispam) {
                        const now = Date.now();
                        const spamData = groupDb?.spam || [];
                        const senderSpam = spamData.find(spam => tools.cmd.areJidsSameUser(spam.jid, senderLid)) || {
                            jid: senderLid,
                            count: 0,
                            lastMessageTime: 0
                        };

                        const timeDiff = now - senderSpam.lastMessageTime;
                        const newCount = timeDiff < 5000 ? senderSpam.count + 1 : 1;

                        senderSpam.count = newCount;
                        senderSpam.lastMessageTime = now;
                        if (!spamData.some(spam => tools.cmd.areJidsSameUser(spam.jid, senderLid))) spamData.push(senderSpam);
                        groupDb.spam = spamData;

                        if (newCount > 5) {
                            await ctx.reply(tools.msg.info("Jangan spam, ngelag woy!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                            }
                            groupDb.spam = spamData.filter(spam => spam.jid !== senderLid);
                        }

                        groupDb.save();
                    }

                    // Penanganan antitagsw
                    if (groupDb?.option?.antitagsw) {
                        const checkMedia = msg.message?.protocolMessage?.type === 25;
                        if (!!checkMedia) {
                            await ctx.reply(tools.msg.info("Jangan tag grup di SW, gak ada yg peduli!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
                            }
                        }
                    }

                    // Penanganan antitoxic
                    if (groupDb?.option?.antitoxic) {
                        const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                        if (msg.body && toxicRegex.test(msg.body)) {
                            await ctx.reply(tools.msg.info("Jangan toxic!"));
                            await ctx.deleteMessage(ctx.id, msg.key);
                            if (groupAutokick) {
                                await ctx.group().kick(senderJid);
                            } else {
                                await handleWarning(ctx, senderJid, senderId, senderLid, groupJid, groupDb);
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
};

module.exports.handleWarning = handleWarning;