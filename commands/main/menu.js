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

            const input = ctx.args[0]?.toLowerCase() || null;

            if (input) {
                const selectedCats = input === "all" ? Object.keys(tag) : (tag[input] ? [input] : []);
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

            const text = `— Halo, @${ctx.getId(ctx.sender.jid)}! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}.\n` +
                "\n" +
                `➛ ${formatter.bold("Tanggal")}: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}\n` +
                `➛ ${formatter.bold("Waktu")}: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}\n\n` +
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
                                rows
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