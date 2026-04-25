const { Baileys } = require("@itsreimau/gktw");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help"],
    category: "main",
    code: async (ctx) => {
        try {
            const {
                cmd
            } = ctx.bot;
            const tag = {
                "ai-chat": "AI (Chat)",
                "ai-generate": "AI (Generate)",
                "ai-misc": "AI (Miscellaneous)",
                converter: "Converter",
                downloader: "Downloader",
                game: "Game",
                group: "Group",
                maker: "Maker",
                profile: "Profile",
                search: "Search",
                tool: "Tool",
                owner: "Owner",
                information: "Information",
                misc: "Miscellaneous"
            };

            const getCommands = (categories) => {
                const result = {};
                const allCmds = Array.from(cmd.values());

                categories.forEach(cat => {
                    const filtered = allCmds.filter(c => c.category === cat).map(c => ({
                        name: c.name,
                        permissions: c.permissions || {}
                    }));
                    if (filtered.length > 0) result[cat] = filtered;
                });
                return result;
            };

            const formatPerms = (perms) => {
                let format = "";
                if (perms.coin) format += "ⓒ";
                if (perms.group) format += "Ⓖ";
                if (perms.owner) format += "Ⓞ";
                if (perms.premium) format += "Ⓟ";
                if (perms.private) format += "ⓟ";
                return format;
            };

            const input = ctx.args[0]?.toLowerCase();
            if (input || ctx.used.command === "allmenu") {
                const selectedCats = input === "all" || ctx.used.command === "allmenu" ? Object.keys(tag) : (tag[input] ? [input] : []);
                const commandsData = getCommands(selectedCats);

                if (Object.keys(commandsData).length === 0) return await ctx.reply(`ⓘ ${formatter.italic("Menu tidak ditemukan!")}`);

                let text = "";
                for (const [key, list] of Object.entries(commandsData)) {
                    text += "╭┈┈┈┈┈┈ ♡\n" +
                        `┊ ✿ — ${formatter.bold(tag[key] || key)}\n`;
                    list.forEach(c => {
                        text += `┊ ➛ ${ctx.used.prefix + c.name} ${formatPerms(c.permissions)}\n`;
                    });
                    text += "╰┈┈┈┈┈┈\n\n";
                }

                const profilePictureUrl = await ctx.core.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
                const faviconMMSMetadata = (await Baileys.prepareWAMessageMedia({
                    image: {
                        url: profilePictureUrl
                    }
                }, {
                    upload: ctx.core.waUploadToServer,
                    mediaTypeOverride: "thumbnail-link"
                })).imageMessage;

                await ctx.reply({
                    extendedTextMessage: {
                        text: text.trim(),
                        contextInfo: {
                            externalAdReply: {
                                title: config.bot.name,
                                body: config.msg.footer,
                                mediaType: 1,
                                thumbnailUrl: config.bot.thumbnail,
                                sourceUrl: config.bot.thumbnail,
                                renderLargerThumbnail: true
                            }
                        },
                        faviconMMSMetadata: {
                            thumbnailDirectPath: faviconMMSMetadata.directPath,
                            thumbnailSha256: faviconMMSMetadata.fileSha256,
                            thumbnailEncSha256: faviconMMSMetadata.fileEncSha256,
                            mediaKey: faviconMMSMetadata.mediaKey,
                            mediaKeyTimestamp: faviconMMSMetadata.mediaKeyTimestamp,
                            thumbnailHeight: 72,
                            thumbnailWidth: 72
                        }
                    },
                    raw: true
                });
            } else {
                const userDb = ctx.db.user;
                const text = `— Halo, @${ctx.getId(ctx.sender.jid)}! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}.\n` +
                    "\n" +
                    `➛ ${formatter.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["hari", "jam"])} tersisa` : "Selamanya"})` : "Freemium")}\n` +
                    `➛ ${formatter.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                    `➛ ${formatter.bold("Koin")}: ${ctx.sender.isOwner() || userDb?.premium ? "Tak terbatas" : userDb?.coin}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Mode")}: ${tools.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
                    `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                    `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"}\n` +
                    `➛ ${formatter.bold("Library")}: @itsreimau/gktw\n` +
                    "\n" +
                    `☆ ${formatter.italic("Jangan lupa berdonasi agar bot tetap online.")}`;

                const rows = Object.keys(tag).map(category => ({
                    title: tag[category],
                    description: `Klik untuk melihat perintah ${tag[category]}`,
                    id: `${ctx.used.prefix + ctx.used.command} ${category}`
                }));

                rows.unshift({
                    title: "Semua Kategori",
                    description: "Klik untuk melihat semua perintah sekaligus",
                    id: `${ctx.used.prefix + ctx.used.command} all`
                });

                await ctx.reply({
                    image: {
                        url: config.bot.thumbnail
                    },
                    caption: text.trim(),
                    mentions: [ctx.sender.jid],
                    footer: config.msg.footer,
                    optionText: "Opsi",
                    optionTitle: "Pilih Opsi",
                    offerText: config.bot.name,
                    offerCode: config.system.customPairingCode,
                    offerUrl: config.bot.groupLink,
                    offerExpiration: Date.now() + 3_600_000,
                    nativeFlow: [{
                        text: "Daftar Menu",
                        sections: [{
                            title: "Pilih Kategori Menu",
                            highlight_label: "🌕",
                            rows
                        }]
                    }, {
                        text: "Hubungi Owner",
                        id: `${ctx.used.prefix}owner`
                    }, {
                        text: "Donasi",
                        id: `${ctx.used.prefix}donate`
                    }]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};