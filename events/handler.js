// Impor modul dan dependensi yang diperlukan
const { Baileys, Events, VCardBuilder } = require("@itsreimau/gktw");
const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("node:fs");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(bot, m, type, isSimulate = false) {
    const groupJid = m.id;
    const groupDb = await db.get(`group.${bot.getId(groupJid)}`) || {};
    const botDb = await db.get("bot") || {};

    if (!isSimulate && groupDb?.mutebot) return;
    if (!isSimulate && !groupDb?.option?.welcome) return;
    if (!isSimulate && ["private", "self"].includes(botDb?.mode)) return;

    const now = moment().tz(config.system.timeZone);
    const hour = now.hour();
    if (!isSimulate && hour >= 0 && hour < 6) return;

    for (const jid of m.participants) {
        const isWelcome = type === Events.UserJoin;
        const userTag = `@${bot.getId(jid)}`;
        const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
        const metadata = await bot.core.groupMetadata(groupJid);
        const text = customText ?
            customText
            .replace(/%tag%/g, userTag)
            .replace(/%subject%/g, metadata.subject)
            .replace(/%description%/g, metadata.description) :
            (isWelcome ?
                formatter.quote(`👋 Selamat datang ${userTag} di grup ${metadata.subject}!`) :
                formatter.quote(`👋 Selamat tinggal, ${userTag}!`));
        const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

        await bot.core.sendMessage(groupJid, {
            text,
            mentions: [jid],
            contextInfo: {
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
            quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.footer)
        });

        if (isWelcome && groupDb?.text?.intro) await bot.core.sendMessage(groupJid, {
            text: groupDb.text.intro,
            mentions: [jid]
        }, {
            quoted: tools.cmd.fakeMetaAiQuotedText("Jangan lupa untuk mengisi intro!")
        });
    }
}

// Fungsi untuk menambahkan warning
async function addWarning(ctx, senderJid, groupDb, groupId) {
    const senderId = ctx.getId(senderJid);

    const maxWarnings = groupDb?.maxwarnings || 3;
    const warnings = groupDb?.warnings || [];

    const userWarning = warnings.find(warning => warning.userId === ctx.keyDb.user);
    let currentWarnings = userWarning ? userWarning.count : 0;
    currentWarnings += 1;

    if (userWarning) {
        userWarning.count = currentWarnings;
    } else {
        warnings.push({
            userId: ctx.keyDb.user,
            count: currentWarnings
        });
    }

    await db.set(`group.${groupId}.warnings`, warnings);
    await ctx.reply({
        text: formatter.quote(`⚠️ Warning ${currentWarnings}/${maxWarnings} untuk @${ctx.keyDb.user}!`),
        mentions: [senderJid]
    });

    if (currentWarnings >= maxWarnings) {
        await ctx.reply(formatter.quote(`⛔ Anda telah menerima ${maxWarnings} warning dan akan dikeluarkan dari grup!`));
        if (!config.system.restrict) await ctx.group().kick(senderJid);
        await db.set(`group.${groupId}.warnings`, warnings.filter(warning => warning.userId !== ctx.keyDb.user));
    }
}

// Events utama bot
module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Tetapkan max listeners untuk events

    // Event saat bot siap
    bot.ev.once(Events.ClientReady, async (m) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${m.user.id}`);

        // Mulai ulang bot
        const botRestart = await db.get("bot.restart") || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: formatter.quote(`✅ Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`),
                edit: botRestart.key
            });
            await db.delete("bot.restart");
        }

        // Tetapkan config pada bot
        config.bot.groupLink: await bot.core.groupInviteCode(config.bot.groupJid).then(code => `https://chat.whatsapp.com/${code}`).catch(() => "https://chat.whatsapp.com/FxEYZl2UyzAEI2yhaH34Ye");
    });

    // Event saat bot menerima pesan
    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = ctx.isPrivate();
        const senderJid = ctx.sender.jid;
        const senderPnId = ctx.getId(ctx.sender.pn);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? ctx.getId(groupJid) : null;
        const isOwner = tools.cmd.isOwner(senderPnId, ctx.getId(ctx.me.id), m.key.id);
        const isCmd = tools.cmd.isCmd(m.content, ctx.bot);
        const isAdmin = isGroup ? await ctx.group().isAdmin(senderJid) : false;

        // Mengambil database
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${ctx.keyDb.user}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        // Grup atau Pribadi
        if (isGroup || isPrivate) {
            if (m.key.fromMe || Baileys.isJidStatusBroadcast(m.key.remoteJid) || Baileys.isJidNewsletter(m.key.remoteJid)) return;

            config.bot.uptime = tools.msg.convertMsToDuration(Date.now() - config.bot.readyAt); // Penangan pada uptime
            config.bot.dbSize = fs.existsSync("database.json") ? tools.msg.formatSize(fs.statSync("database.json").size / 1024) : "N/A"; // Penangan pada ukuran database

            // Penanganan database pengguna
            if (!userDb?.username) await db.set(`user.${ctx.keyDb.user}.username`, `@user_${tools.cmd.generateUID(ctx.keyDb.user, false)}`);
            if (!userDb?.uid || userDb?.uid !== tools.cmd.generateUID(ctx.keyDb.user)) await db.set(`user.${ctx.keyDb.user}.uid`, tools.cmd.generateUID(ctx.keyDb.user));
            if (userDb?.premium && Date.now() > userDb.premiumExpiration) {
                await db.delete(`user.${ctx.keyDb.user}.premium`);
                await db.delete(`user.${ctx.keyDb.user}.premiumExpiration`);
            }
            if (isOwner || userDb?.premium) await db.set(`user.${ctx.keyDb.user}.coin`, 0);
            if (!userDb?.coin || !Number.isFinite(userDb.coin)) await db.set(`user.${ctx.keyDb.user}.coin`, 500);

            // Pengecekan mode bot (premium, group, private, self)
            if (botDb?.mode === "premium" && !isOwner && !userDb?.premium) return;
            if (botDb?.mode === "group" && isPrivate && !isOwner && !userDb?.premium) return;
            if (botDb?.mode === "private" && isGroup && !isOwner && !userDb?.premium) return;
            if (botDb?.mode === "self" && !isOwner) return;

            // Pengecekan mute pada grup
            if (groupDb?.mutebot === true && !isOwner && !isAdmin) return;
            if (groupDb?.mutebot === "owner" && !isOwner) return;
            const muteList = groupDb?.mute || [];
            if (muteList.includes(ctx.keyDb.user)) await ctx.deleteMessage(m.key);

            // Pengecekan untuk tidak tersedia pada malam hari
            const now = moment().tz(config.system.timeZone);
            const hour = now.hour();
            if (hour >= 0 && hour < 6 && !isOwner && !userDb?.premium) return;

            // Penanganan bug hama!
            const analyze = Baileys.analyzeBug(m.message);
            if (analyze.isMalicious) {
                await ctx.deleteMessage(m.key);
                await ctx.block(senderJid);
                await db.set(`user.${ctx.keyDb.user}.banned`, true);

                await ctx.sendMessage(config.owner.id + Baileys.S_WHATSAPP_NET, {
                    text: `📢 Akun @${ctx.keyDb.user} telah diblokir secara otomatis karena alasan ${formatter.inlineCode(analyze.reason)}.`,
                    mentions: [senderJid]
                });
            }

            // Did you mean?
            if (isCmd?.didyoumean) await ctx.reply({
                text: formatter.quote(`🧐 Apakah maksudmu ${formatter.inlineCode(isCmd.prefix + isCmd.didyoumean)}?`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${isCmd.prefix + isCmd.didyoumean} ${isCmd.input}`,
                    buttonText: {
                        displayText: "Ya, benar!"
                    }
                }]
            });

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const userAfk = userDb?.afk || {};
            if (userAfk.reason || userAfk.timestamp) {
                const timeElapsed = Date.now() - userAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(formatter.quote(`📴 Anda telah keluar dari AFK ${userAfk.reason ? `dengan alasan ${formatter.inlineCode(userAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`));
                    await db.delete(`user.${ctx.keyDb.user}.afk`);
                }
            }
        }

        // Penanganan obrolan grup
        if (isGroup) {
            if (m.key.fromMe || Baileys.isJidStatusBroadcast(m.key.remoteJid) || Baileys.isJidNewsletter(m.key.remoteJid)) return;

            if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from group: ${groupId}, by: ${senderPnId}`); // Log pesan masuk

            // Variabel umum
            const groupAutokick = groupDb?.option?.autokick;

            // Penanganan database grup
            if (groupDb?.sewa && Date.now() > userDb?.sewaExpiration) {
                await db.delete(`group.${groupId}.sewa`);
                await db.delete(`group.${groupId}.sewaExpiration`);
            }

            // Penanganan AFK (Pengguna yang disebutkan atau di-balas/quote)
            const userAfkMentions = ctx.quoted ? [ctx.getId(ctx.quoted.sender)] : ctx.getMentioned().map(jid => ctx.getId(jid));
            if (userAfkMentions.length > 0) {
                for (const userAfkMention of userAfkMentions) {
                    const userAfk = await db.get(`user.${userAfkMention}.afk`) || {};
                    if (userAfk.reason || userAfk.timestamp) {
                        const timeago = tools.msg.convertMsToDuration(Date.now() - userAfk.timestamp);
                        await ctx.reply(formatter.quote(`📴 Jangan tag! Dia sedang AFK ${userAfk.reason ? `dengan alasan ${formatter.inlineCode(userAfk.reason)}` : "tanpa alasan"} selama ${timeago}.`));
                    }
                }
            }

            // Penanganan antimedia
            for (const type of ["audio", "document", "gif", "image", "sticker", "video"]) {
                if (groupDb?.option?.[`anti${type}`] && !isOwner && !isAdmin) {
                    const checkMedia = tools.cmd.checkMedia(ctx.getMessageType(), type);
                    if (checkMedia) {
                        await ctx.reply(formatter.quote(`⛔ Jangan kirim ${type}!`));
                        await ctx.deleteMessage(m.key);
                        if (groupAutokick) {
                            await ctx.group().kick(senderJid);
                        } else {
                            await addWarning(ctx, senderJid, ctx.keyDb.user, groupDb, groupId);
                        }
                    }
                }
            }

            // Penanganan antilink
            if (groupDb?.option?.antilink && !isOwner && !isAdmin) {
                if (m.content && tools.cmd.isUrl(m.content)) {
                    await ctx.reply(formatter.quote("⛔ Jangan kirim link!"));
                    await ctx.deleteMessage(m.key);
                    if (groupAutokick) {
                        await ctx.group().kick(senderJid);
                    } else {
                        await addWarning(ctx, senderJid, ctx.keyDb.user, groupDb, groupId);
                    }
                }
            }

            // Penanganan antispam
            if (groupDb?.option?.antispam && !isOwner && !isAdmin) {
                const now = Date.now();
                const spamData = await db.get(`group.${groupId}.spam`) || [];

                const userSpam = spamData.find(spam => spam.userId === ctx.keyDb.user) || {
                    userId: ctx.keyDb.user,
                    count: 0,
                    lastMessageTime: 0
                };

                const timeDiff = now - userSpam.lastMessageTime;
                const newCount = timeDiff < 5000 ? userSpam.count + 1 : 1;

                userSpam.count = newCount;
                userSpam.lastMessageTime = now;

                if (!spamData.some(spam => spam.userId === ctx.keyDb.user)) spamData.push(userSpam);

                await db.set(`group.${groupId}.spam`, spamData);

                if (newCount > 5) {
                    await ctx.reply(formatter.quote("⛔ Jangan spam, ngelag woy!"));
                    await ctx.deleteMessage(m.key);
                    if (groupAutokick) {
                        await ctx.group().kick(senderJid);
                    } else {
                        await addWarning(ctx, senderJid, ctx.keyDb.user, groupDb, groupId);
                    }
                    await db.set(`group.${groupId}.spam`, spamData.filter(spam => spam.userId !== ctx.keyDb.user));
                }
            }

            // Penanganan antitagsw
            if (groupDb?.option?.antitagsw && !isOwner && !isAdmin) {
                const checkMedia = tools.cmd.checkMedia(ctx.getMessageType(), "groupStatusMention") || m.message?.groupStatusMentionMessage?.protocolMessage?.type === 25;
                if (checkMedia) {
                    await ctx.reply(formatter.quote(`⛔ Jangan tag grup di SW, gak ada yg peduli!`));
                    await ctx.deleteMessage(m.key);
                    if (groupAutokick) {
                        await ctx.group().kick(senderJid);
                    } else {
                        await addWarning(ctx, senderJid, ctx.keyDb.user, groupDb, groupId);
                    }
                }
            }

            // Penanganan antitoxic
            if (groupDb?.option?.antitoxic && !isOwner && !isAdmin) {
                const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                if (m.content && toxicRegex.test(m.content)) {
                    await ctx.reply(formatter.quote("⛔ Jangan toxic!"));
                    await ctx.deleteMessage(m.key);
                    if (groupAutokick) {
                        await ctx.group().kick(senderJid);
                    } else {
                        await addWarning(ctx, senderJid, ctx.keyDb.user, groupDb, groupId);
                    }
                }
            }
        }

        // Penanganan obrolan pribadi
        if (isPrivate) {
            if (m.key.fromMe || Baileys.isJidStatusBroadcast(m.key.remoteJid) || Baileys.isJidNewsletter(m.key.remoteJid)) return;

            if (!isCmd || isCmd?.didyoumean) consolefy.info(`Incoming message from: ${senderPnId}`); // Log pesan masuk

            // Penanganan menfess
            const allMenfessDb = await db.get("menfess") || {};
            if (!isCmd || isCmd?.didyoumean) {
                for (const [menfessId, {
                        from,
                        to
                    }] of Object.entries(allMenfessDb)) {
                    if (sender === from || sender === to) {
                        const target = (sender === from ? to : from) + Baileys.LID;
                        if (m.content === "delete") {
                            const replyText = formatter.quote("✅ Sesi menfess telah dihapus!");
                            await ctx.reply(replyText);
                            await ctx.sendMessage(target, {
                                text: replyText
                            });
                            await db.delete(`menfess.${menfessId}`);
                        } else {
                            await ctx.forwardMessage(target, m);
                        }
                    }
                }
            }
        }
    });

    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (calls) => {
        if (!config.system.antiCall) return;

        for (const call of calls) {
            if (Baileys.isJidGroup(call.chatId)) return;

            const senderJid = call.from;
            const senderId = bot.getId(senderJid);

            consolefy.info(`Incoming call from: ${ctx.getId(await bot.core.getLidUser(senderJid)[0].lid)}`); // Log panggilan masuk

            if (call.status !== "offer") continue;

            await bot.core.rejectCall(call.id, senderJid);
            await db.set(`user.${senderId}.banned`, true);

            await bot.core.sendMessage(config.owner.id + Baileys.S_WHATSAPP_NET, {
                text: `📢 Akun @${senderId} telah diblokir secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`,
                mentions: [senderJid]
            });

            const vcard = new VCardBuilder()
                .setFullName(config.owner.name)
                .setOrg(config.owner.organization)
                .setNumber(config.owner.id)
                .build();
            await bot.core.sendMessage(senderJid, {
                contacts: {
                    displayName: config.owner.name,
                    contacts: [{
                        vcard
                    }]
                }
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText(`Bot tidak dapat menerima panggilan ${call.isVideo ? "video" : "suara"}! Jika Anda memerlukan bantuan, silakan menghubungi Owner.`)
            });
        }
    });

    // Event saat pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (m) => handleWelcome(bot, m, Events.UserJoin));
    bot.ev.on(Events.UserLeave, async (m) => handleWelcome(bot, m, Events.UserLeave));
};
module.exports.handleWelcome = handleWelcome; // Penanganan event pengguna bergabung/keluar grup