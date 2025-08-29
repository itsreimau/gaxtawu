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

            let text = `Halo, @${ctx.getId(ctx.sender.jid)}! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya.\n` +
                "\n" +
                `${formatter.quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${formatter.quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${formatter.quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                `${formatter.quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${formatter.quote("Library: @itsreimau/gktw (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                `${formatter.italic("Jangan lupa berdonasi agar bot tetap online.")}\n` +
                `${config.msg.readmore}\n`;

            for (const category of Object.keys(tag)) {
                const cmds = Array.from(cmd.values())
                    .filter(cmd => cmd.category === category)
                    .map(cmd => ({
                        name: cmd.name,
                        aliases: cmd.aliases,
                        permissions: cmd.permissions || {}
                    }));

                if (cmds.length > 0) {
                    text += `✾ ${formatter.bold(tag[category])}\n`;

                    cmds.forEach(cmd => {
                        let permissionsText = "";
                        if (cmd.permissions.coin) permissionsText += "ⓒ";
                        if (cmd.permissions.group) permissionsText += "Ⓖ";
                        if (cmd.permissions.owner) permissionsText += "Ⓞ";
                        if (cmd.permissions.premium) permissionsText += "Ⓟ";
                        if (cmd.permissions.private) permissionsText += "ⓟ";

                        text += formatter.quote(formatter.monospace(`${ctx.used.prefix + cmd.name} ${permissionsText}`));
                        text += "\n";
                    });
                }

                text += "\n";

            }

            await ctx.sendMessage(ctx.id, {
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
                }, {
                    buttonId: `${ctx.used.prefix}donate`,
                    buttonText: {
                        displayText: "Donasi"
                    }
                }]
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.note)
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};