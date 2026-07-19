module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(
            `✦ — Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` + // Dapat diubah sesuai keinginan
            "\n" +
            `❖ ${ctx.text.bold("Bot")}: ${config.bot.name}\n` +
            `❖ ${ctx.text.bold("Versi")}: ${pkg.version}\n` +
            `❖ ${ctx.text.bold("Owner")}: ${config.owner.name}\n` +
            `❖ ${ctx.text.bold("Mode")}: ${ctx.text.ucwords(ctx.db.bot?.mode || "public")}\n` +
            `❖ ${ctx.text.bold("Uptime")}: ${ctx.text.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
            `❖ ${ctx.text.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
            `❖ ${ctx.text.bold("Library")}: Baileys (${ctx.helper.getBaileysVesion()})`
        );
    }
};