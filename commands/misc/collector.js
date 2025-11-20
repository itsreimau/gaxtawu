const util = require("node:util");

module.exports = {
        name: "collector",
        aliases: ["collect"],
        category: "misc",
        code: async (ctx) => {
            const timeout = parseInt(ctx.args[0]) || 60000;
            if (isNaN(timeout)) return await ctx.reply(`ⓘ ${formatter.italic("Waktu timeout harus berupa angka!")}`);

            try {
                const collector = ctx.MessageCollector({
                    time: timeout
                });
                await ctx.reply(`ⓘ ${formatter.italic(`Collector dimulai dengan timeout ${tools.msg.convertMsToDuration(timeout)}`)}`);

                collector.on("collect", async (m) => {
                    await ctx.core.sendMessage(ctx.id, {
                        text: util.inspect(m)
                    }, {
                        quoted: m
                    });
                });

                collector.on("end", async () => {
                    await ctx.reply(`ⓘ ${formatter.italic("Collector berhenti!")}`);
                });
            }
        };