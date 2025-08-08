const moment = require("moment-timezone");

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
                "ai-image": "AI (Image)",
                "ai-video": "AI (Video)",
                "ai-misc": "AI (Miscellaneous)",
                "converter": "Converter",
                "downloader": "Downloader",
                "entertainment": "Entertainment",
                "game": "Game",
                "group": "Group",
                "maker": "Maker",
                "profile": "Profile",
                "search": "Search",
                "tool": "Tool",
                "owner": "Owner",
                "information": "Information",
                "misc": "Miscellaneous"
            };

            if (ctx.args[0]) {
                const category = ctx.args[0].toLowerCase();
                const categoryCmds = Array.from(cmd.values())
                    .filter(cmd => cmd.category === category)
                    .map(cmd => ({
                        name: cmd.name,
                        aliases: cmd.aliases,
                        permissions: cmd.permissions || {}
                    }));

                if (categoryCmds.length === 0) return await ctx.reply("Menu tidak ditemukan!");

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
                        },
                        {
                            buttonId: `${ctx.used.prefix}donate`,
                            buttonText: {
                                displayText: "Donasi"
                            }
                        }
                    ]
                });
            }

            let text = `Halo @${ctx.getId(ctx.sender.jid)}, berikut adalah daftar menu yang tersedia!\n` +
                "\n" +
                `${formatter.quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${formatter.quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${formatter.quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                `${formatter.quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${formatter.quote("Library: @itsreimau/gktw (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                `${formatter.italic("Jangan lupa berdonasi agar bot tetap online!")}\n`;

            return await ctx.reply({
                image: {
                    url: config.bot.thumbnail
                },
                mimetype: tools.mime.lookup("png"),
                caption: text.trim(),
                mentions: [ctx.sender.jid],
                footer: config.msg.footer,
                buttons: [{
                        buttonId: `${ctx.used.prefix}owner`,
                        buttonText: {
                            displayText: "Hubungi Owner"
                        }
                    },
                    {
                        buttonId: `${ctx.used.prefix}donate`,
                        buttonText: {
                            displayText: "Donasi"
                        }
                    },
                    {
                        buttonId: null,
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
                                    highlight_label: "☺",
                                    rows: Object.keys(tag).map(category => ({
                                        title: tag[category],
                                        description: `Klik untuk melihat perintah ${tag[category]}`,
                                        id: `.menu ${category}`
                                    }))
                                }]
                            })
                        }
                    }
                ]
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.note)
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};