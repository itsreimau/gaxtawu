module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",
    code: async (ctx) => {
        try {
            const botDb = await db.get("bot") || {};

            await ctx.reply({
                text: `${formatter.quote(`👋 Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan kamu!`)}\n` + // Dapat diubah sesuai keinginan
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    `${formatter.quote(`Nama Bot: ${config.bot.name}`)}\n` +
                    `${formatter.quote(`Versi: ${require("../../package.json").version}`)}\n` +
                    `${formatter.quote(`Owner: ${config.owner.name}`)}\n` +
                    `${formatter.quote(`Mode: ${tools.msg.ucwords(botDb?.mode || "public")}`)}\n` +
                    `${formatter.quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                    `${formatter.quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                    formatter.quote("Library: @itsreimau/gktw (Fork of @mengkodingan/ckptw)"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};