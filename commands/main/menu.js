const moment = require("moment-timezone");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help", "list", "listmenu"],
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

            let text = `— Halo, @${ctx.getId(ctx.sender.jid)}! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya.\n` +
                "\n" +
                `➛ ${formatter.bold("Tanggal")}: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}\n` +
                `➛ ${formatter.bold("Waktu")}: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}\n` +
                "\n" +
                `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
                `➛ ${formatter.bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)\n` +
                "\n" +
                `☆ ${formatter.italic("Jangan lupa berdonasi agar bot tetap online.")}\n` +
                `${"\u200E".repeat(4001)}\n`;

            for (const category of Object.keys(tag)) {
                const cmds = Array.from(cmd.values()).filter(cmd => cmd.category === category).map(cmd => ({
                    name: cmd.name,
                    aliases: cmd.aliases,
                    permissions: cmd.permissions || {}
                }));

                if (cmds.length > 0) {
                    text += "╭┈┈┈┈┈┈ ♡\n" +
                        `┊ ✿ — ${formatter.bold(tag[category])}\n`;

                    cmds.forEach(cmd => {
                        let permissionsText = "";
                        if (cmd.permissions.coin) permissionsText += "ⓒ";
                        if (cmd.permissions.group) permissionsText += "Ⓖ";
                        if (cmd.permissions.owner) permissionsText += "Ⓞ";
                        if (cmd.permissions.premium) permissionsText += "Ⓟ";
                        if (cmd.permissions.private) permissionsText += "ⓟ";

                        text += `┊ ➛ ${ctx.used.prefix + cmd.name} ${permissionsText}\n`;
                    });
                }

                text += "╰┈┈┈┈┈┈\n";
            }

            await ctx.core.sendMessage(ctx.id, {
                image: {
                    url: "https://picsum.photos/536/354"
                },
                mimetype: tools.mime.lookup("png"),
                caption: text.trim(),
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: config.bot.newsletterJid,
                        newsletterName: config.msg.footer
                    },
                    externalAdReply: {
                        title: config.bot.name,
                        body: config.msg.note,
                        mediaType: 1,
                        thumbnailUrl: config.bot.thumbnail,
                        sourceUrl: config.bot.groupLink,
                        renderLargerThumbnail: true
                    }
                },
                footer: formatter.italic(config.msg.footer),
                buttons: [{
                    buttonId: `${ctx.used.prefix}owner`,
                    buttonText: {
                        displayText: "Hubungi Owner"
                    }
                }, {
                    buttonId: `${ctx.used.prefix}donate`,
                    buttonText: {
                        displayText: "Donasi"
                    }
                }]
            }, {
                quoted: tools.cmd.fakeQuotedText(config.msg.note)
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};