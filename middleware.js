// Impor modul dan dependensi yang diperlukan
const { Baileys, Cooldown } = require("@itsreimau/gktw");
const moment = require("moment-timezone");

// Fungsi untuk mengecek koin pengguna
async function checkCoin(requiredCoin, userDb, senderLidId, isOwner) {
    if (isOwner || userDb?.premium) return false;
    if (userDb?.coin < requiredCoin) return true;
    await db.subtract(`user.${senderLidId}.coin`, requiredCoin);
    return false;
}

// Middleware utama bot
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;
        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);
        const senderLidId = ctx.getId(ctx.sender.lid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? ctx.getId(groupJid) : null;
        const isOwner = tools.cmd.isOwner(senderId, ctx.msg.key.id);
        const isAdmin = isGroup ? await ctx.group().isAdmin(senderJid) : false;

        // Mengambil database
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderLidId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        // Pengecekan mode bot (group, private, self)
        if (botDb?.mode === "premium" && !isOwner && !userDb?.premium) return;
        if (botDb?.mode === "group" && isPrivate && !isOwner && !userDb?.premium) return;
        if (botDb?.mode === "private" && isGroup && !isOwner && !userDb?.premium) return;
        if (botDb?.mode === "self" && !isOwner) return;

        // Pengecekan mute pada grup
        if (groupDb?.mutebot === true && !isOwner && !isAdmin) return;
        if (groupDb?.mutebot === "owner" && !isOwner) return;
        const muteList = groupDb?.mute || [];
        if (muteList.includes(senderLidId)) return;

        // Log command masuk
        if (isGroup && !ctx.msg.key.fromMe) {
            consolefy.info(`Incoming command: ${ctx.used.command}, from group: ${groupId}, by: ${Baileys.isLidUser(senderJid) ? `${senderId} (LID)` : senderId}`);
        } else if (isPrivate && !ctx.msg.key.fromMe) {
            consolefy.info(`Incoming command: ${ctx.used.command}, from: ${Baileys.isLidUser(senderJid) ? `${senderId} (LID)` : senderId}`);
        }

        // Menambah XP pengguna dan menangani level-up
        const xpGain = 10;
        const xpToLevelUp = 100;
        let newUserXp = (userDb?.xp || 0) + xpGain;
        if (newUserXp >= xpToLevelUp) {
            let newUserLevel = (userDb?.level || 0) + 1;
            newUserXp -= xpToLevelUp;

            if (userDb?.autolevelup) {
                const profilePictureUrl = await ctx.core.profilePictureUrl(senderJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
                await ctx.reply({
                    text: formatter.quote(`🎊 Selamat! Anda telah naik ke level ${newUserLevel}.`),
                    footer: config.msg.footer,
                    buttons: [{
                        buttonId: `${ctx.used.prefix}setprofile autolevelup`,
                        buttonText: {
                            displayText: "Nonaktifkan Autolevelup"
                        }
                    }]
                });
            }

            await db.set(`user.${senderLidId}.xp`, newUserXp);
            await db.set(`user.${senderLidId}.level`, newUserLevel);
        } else {
            await db.set(`user.${senderLidId}.xp`, newUserXp);
        }

        // Pemberitahuan migrasi database ke LID
        if (await db.get(`user.${senderId}`) && ctx.used.command !== "migrate" && Baileys.isJidUser(senderJid)) await ctx.reply({
            text: formatter.quote(`📍 Anda terdaftar di database lama. Ingin bermigrasi ke database baru?`),
            footer: config.msg.footer,
            buttons: [{
                buttonId: `${ctx.used.prefix}migrate ${senderId}`,
                buttonText: {
                    displayText: "Ya, ingin!"
                }
            }]
        });

        // Simulasi mengetik
        const simulateTyping = () => {
            if (config.system.autoTypingOnCmd) ctx.simulateTyping();
        };

        // Pengecekan kondisi restrictions
        const restrictions = [{
            key: "banned",
            condition: userDb?.banned && ctx.used.command !== "owner",
            msg: config.msg.banned,
            buttons: [{
                buttonId: `${ctx.used.prefix}owner`,
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }],
            reaction: "🚫"
        }, {
            key: "cooldown",
            condition: new Cooldown(ctx, config.system.cooldown).onCooldown && !isOwner && !userDb?.premium,
            msg: config.msg.cooldown,
            reaction: "💤"
        }, {
            key: "gamerestrict",
            condition: groupDb?.option?.gamerestrict && isGroup && !isAdmin && ctx.bot.cmd.get(ctx.used.command).category === "game",
            msg: config.msg.gamerestrict,
            reaction: "🎮"
        }, {
            key: "privatePremiumOnly",
            condition: config.system.privatePremiumOnly && isPrivate && !isOwner && !userDb?.premium && !["price", "owner"].includes(ctx.used.command),
            msg: config.msg.privatePremiumOnly,
            buttons: [{
                buttonId: `${ctx.used.prefix}price`,
                buttonText: {
                    displayText: "Harga Premium"
                }
            }, {
                buttonId: `${ctx.used.prefix}owner`,
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }],
            reaction: "💎"
        }, {
            key: "requireBotGroupMembership",
            condition: config.system.requireBotGroupMembership && !isOwner && !userDb?.premium && ctx.used.command !== "botgroup" && config.bot.groupJid && !(await ctx.group(config.bot.groupJid).members()).some(member => member.jid === senderJid),
            msg: config.msg.botGroupMembership,
            buttons: [{
                buttonId: `${ctx.used.prefix}botgroup`,
                buttonText: {
                    displayText: "Grup Bot"
                }
            }],
            reaction: "🚫"
        }, {
            key: "requireGroupSewa",
            condition: config.system.requireGroupSewa && isGroup && !isOwner && !["price", "owner"].includes(ctx.used.command) && groupDb?.sewa !== true,
            msg: config.msg.groupSewa,
            buttons: [{
                buttonId: `${ctx.used.prefix}price`,
                buttonText: {
                    displayText: "Harga Sewa"
                }
            }, {
                buttonId: `${ctx.used.prefix}owner`,
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }],
            reaction: "🔒"
        }, {
            key: "unavailableAtNight",
            condition: (() => {
                const now = moment().tz(config.system.timeZone);
                const hour = now.hour();
                return config.system.unavailableAtNight && !isOwner && !userDb?.premium && hour >= 0 && hour < 6;
            })(),
            msg: config.msg.unavailableAtNight,
            reaction: "😴"
        }];

        for (const {
                condition,
                msg,
                reaction,
                key,
                buttons
            }
            of restrictions) {
            if (condition) {
                const now = Date.now();
                const lastSentMsg = userDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;
                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    simulateTyping();
                    await db.set(`user.${senderLidId}.lastSentMsg.${key}`, now);
                    return await ctx.reply({
                        text: msg,
                        footer: formatter.italic(`Respon selanjutnya akan berupa reaksi emoji ${formatter.inlineCode(reaction)}.`),
                        buttons: buttons || null
                    });
                } else {
                    return await ctx.replyReact(reaction);
                }
            }
        }

        // Pengecekan kondisi permissions
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd?.aliases || [])].includes(ctx.used.command));
        if (!command) return await next();
        const {
            permissions = {}
        } = command;
        const permissionChecks = [{
            key: "admin",
            condition: isGroup && !isAdmin,
            msg: config.msg.admin,
            reaction: "🛡️"
        }, {
            key: "botAdmin",
            condition: isGroup && !await ctx.group().isBotAdmin(),
            msg: config.msg.botAdmin,
            reaction: "🤖"
        }, {
            key: "coin",
            condition: permissions.coin && config.system.useCoin && await checkCoin(permissions.coin, userDb, senderLidId, isOwner),
            msg: config.msg.coin,
            buttons: [{
                buttonId: `${ctx.used.prefix}coin`,
                buttonText: {
                    displayText: "Cek Koin"
                }
            }],
            reaction: "💰"
        }, {
            key: "group",
            condition: isPrivate,
            msg: config.msg.group,
            reaction: "👥"
        }, {
            key: "owner",
            condition: !isOwner,
            msg: config.msg.owner,
            reaction: "👑"
        }, {
            key: "premium",
            condition: !isOwner && !userDb?.premium,
            msg: config.msg.premium,
            buttons: [{
                buttonId: `${ctx.used.prefix}price`,
                buttonText: {
                    displayText: "Harga Premium"
                }
            }, {
                buttonId: `${ctx.used.prefix}owner`,
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }],
            reaction: "💎"
        }, {
            key: "private",
            condition: isGroup,
            msg: config.msg.private,
            reaction: "📩"
        }, {
            key: "restrict",
            condition: config.system.restrict,
            msg: config.msg.restrict,
            reaction: "🚫"
        }];

        for (const {
                key,
                condition,
                msg,
                reaction,
                buttons
            }
            of permissionChecks) {
            if (permissions[key] && condition) {
                const now = Date.now();
                const lastSentMsg = userDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;
                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    simulateTyping();
                    await db.set(`user.${senderLidId}.lastSentMsg.${key}`, now);
                    return await ctx.reply({
                        text: msg,
                        footer: formatter.italic(`Respon selanjutnya akan berupa reaksi emoji ${formatter.inlineCode(reaction)}.`),
                        buttons: buttons || null
                    });
                } else {
                    return await ctx.replyReact(reaction);
                }
            }
        }

        simulateTyping();
        await next(); // Lanjut ke proses berikutnya
    });
};