module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(
            `✦ — Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` + // Dapat diubah sesuai keinginan
            "\n" +
            `❖ ${tools.msg.bold("Bot")}: ${config.bot.name}\n` +
            `❖ ${tools.msg.bold("Versi")}: ${require("../../package.json").version}\n` +
            `❖ ${tools.msg.bold("Owner")}: ${config.owner.name}\n` +
            `❖ ${tools.msg.bold("Mode")}: ${tools.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
            `❖ ${tools.msg.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
            `❖ ${tools.msg.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
            `❖ ${tools.msg.bold("Library")}: @itsliaaa/baileys.`
        );
    }
};