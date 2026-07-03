// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, Gktw } = require("@itsreimau/gktw");
const moment = require("moment-timezone");
const { styleText } = require("node:util");

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

            if (!senderDb || !groupDb) return;

            // Penanganan database pengguna
            if (senderDb?.premium && Date.now() >= senderDb?.premiumExpiration) {
                senderDb.premium = false;
                senderDb.premiumExpiration = null;
                sender.coin = 100;
                senderDb.save();
            }
            senderDb.save();

            // Pengecekan mode bot (premium, group, private, self)
            if (botDb?.mode === "premium" && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "group" && isPrivate && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "private" && isGroup && !isOwner && !senderDb?.premium) return;
            if (botDb?.mode === "self" && !isOwner) return;

            // Pengecekan mute pada grup
            if (groupDb?.mutebot) return;
            const muteList = groupDb?.mute || [];
            groupDb.mute = muteList.filter(mute => !mute.expiration || Date.now() >= mute.expiration);
            if (groupDb.mute.length !== muteList.length) groupDb.save();
            if (groupDb.mute.some(mute => mute.jid === ctx.sender.lid)) await ctx.deleteMessage(ctx.id, msg.key);

            // Pengecekan untuk tidak tersedia pada malam hari
            const now = moment().tz(config.system.timeZone);
            const hour = now.hour();
            if (config.system.unavailableAtNight && !isOwner && !senderDb?.premium && hour >= 0 && hour < 6) return;

            // Did you mean?
            if (isCmd?.didyoumean)
                await ctx.reply({
                    text: tools.msg.info(`Apakah maksudmu ${formatter.inlineCode(isCmd.prefix + isCmd.didyoumean)}?`),
                    buttons: [{
                        text: "Ya, benar!",
                        id: `${isCmd.prefix + isCmd.didyoumean} ${isCmd.input}`
                    }]
                });

            // Penanganan unduhan otomatis
            const autodownloadEnabled = senderDb?.autodownload || false;
            if (autodownloadEnabled && !isCmd) {
                const urlPatterns = {
                    facebook: /(facebook\.com|fb\.watch|fb\.com)/i,
                    instagram: /(instagram\.com|instagr\.am)/i,
                    tiktok: /(tiktok\.com|vt\.tiktok)/i,
                    twitter: /(twitter\.com|x\.com)/i,
                    youtube: /(youtube\.com|youtu\.be)/i
                };
                const platformCommands = {
                    facebook: "facebookdl",
                    instagram: "instagramdl",
                    tiktok: "tiktokdl",
                    twitter: "twitterdl",
                    youtube: "youtubevideo"
                };
                const url = tools.cmd.extractUrlFromText(msg?.body);
                if (url) {
                    let matchedCommand = null;
                    let platform = null;
                    for (const [key, pattern] of Object.entries(urlPatterns)) {
                        if (pattern.test(url)) {
                            platform = key;
                            matchedCommand = platformCommands[key];
                            break;
                        }
                    }
                    if (matchedCommand) {
                        await ctx.reply(`⏳ Download dari ${platform}...`);
                        await bot.forceCommand(ctx.id, matchedCommand, url, ctx.sender);
                    }
                }
            }

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const senderAfk = senderDb?.afk || {};
            if (senderAfk?.reason || senderAfk?.timestamp) {
                const timeElapsed = Date.now() - senderAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(tools.msg.info(`Anda telah keluar dari AFK ${senderAfk.reason ? `dengan alasan ${formatter.inlineCode(senderAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`));
                    senderDb.afk = {};
                    senderDb.save();
                }
            }

            // Penanganan obrolan grup
            if (isGroup) {
                if (!isCmd || isCmd?.didyoumean) console.log(styleText("cyan", `Incoming message from group: ${groupId}, by: ${senderId}`)); // Log pesan masuk

                // Variabel umum
                const messageType = ctx.getMessageType();
                const groupAutokick = groupDb?.option?.autokick;

                // Penanganan database grup
                if (groupDb?.sewa && Date.now() >= senderDb?.sewaExpiration) {
                    senderDb.sewa = false;
                    senderDb.sewaExpiration = null;
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
                if (!isCmd || isCmd?.didyoumean) console.log(styleText("cyan", `Incoming message from: ${senderId}`)); // Log pesan masuk

                // Apa yaa...
            }
        }
    });
};

module.exports.handleWarning = handleWarning;