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

            const arg = ctx.args[0].toLowerCase() || null;
            if (arg === "all") {
                let text = "";

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

                        text += "╰┈┈┈┈┈┈\n\n";
                    }
                }

                return await ctx.reply({
                    text: text.trim(),
                    footer: config.msg.footer,
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
                });
            } else {
                const category = arg;
                const categoryCmds = Array.from(cmd.values()).filter(cmd => cmd.category === category).map(cmd => ({
                    name: cmd.name,
                    aliases: cmd.aliases,
                    permissions: cmd.permissions || {}
                }));

                if (categoryCmds.length === 0) return await ctx.reply(`ⓘ ${formatter.italic("Menu tidak ditemukan!")}`);

                let text = `◆ ${formatter.bold(tag[category] || category)}\n` +
                    "\n";

                categoryCmds.forEach(cmd => {
                    let permissionsText = "";
                    if (cmd.permissions.coin) permissionsText += "ⓒ";
                    if (cmd.permissions.group) permissionsText += "Ⓖ";
                    if (cmd.permissions.owner) permissionsText += "Ⓞ";
                    if (cmd.permissions.premium) permissionsText += "Ⓟ";
                    if (cmd.permissions.private) permissionsText += "ⓟ";

                    text += formatter.quote(formatter.monospace(`${ctx.used.prefix + cmd.name} ${permissionsText}`));
                    text += "\n";
                });

                return await ctx.reply({
                    text: text.trim(),
                    footer: config.msg.footer,
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
                });
            }

            let text = `— Halo, @${ctx.getId(ctx.sender.jid)}! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya.\n` +
                "\n" +
                `➛ ${formatter.bold("Tanggal")}: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}\n` +
                `➛ ${formatter.bold("Waktu")}: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}\n` +
                "\n" +
                `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
                `➛ ${formatter.bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)\n` +
                "\n" +
                `☆ ${formatter.italic("Jangan lupa berdonasi agar bot tetap online.")}`;

            const rows = Object.keys(tag).map(category => ({
                title: tag[category],
                description: `Klik untuk melihat perintah ${tag[category]}`,
                id: `.menu ${category}`
            }));

            rows.unshift({
                title: "Semua Kategori",
                description: "Klik untuk melihat semua perintah sekaligus",
                id: ".menu all"
            });

            return await ctx.reply({
                image: {
                    url: config.bot.thumbnail
                },
                mimetype: tools.mime.lookup("png"),
                caption: text.trim(),
                mentions: [ctx.sender.jid],
                footer: config.msg.footer,
                buttons: [{
                    buttonId: "action",
                    buttonText: {
                        displayText: "Daftar Menu"
                    },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify({
                            title: "Daftar Menu",
                            sections: [{
                                title: "Pilih Kategori Menu",
                                highlight_label: "🌕",
                                rows: rows
                            }]
                        })
                    }
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};