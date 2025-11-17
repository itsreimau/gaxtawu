const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",
    code: async (ctx) => {
        try {
            await ctx.reply(
                `— Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` + // Dapat diubah sesuai keinginan
                "\n" +
                `➛ ${formatter.bold("Bot")}: ${config.bot.name}\n` +
                `➛ ${formatter.bold("Versi")}: ${require("../../package.json").version}\n` +
                `➛ ${formatter.bold("Owner")}: ${config.owner.name}\n` +
                `➛ ${formatter.bold("Mode")}: ${tools.msg.ucwords(config.system?.mode || "public")}\n` +
                `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
                `➛ ${formatter.bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};