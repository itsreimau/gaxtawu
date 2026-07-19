module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply(
            `✦ — Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` + // Dapat diubah sesuai keinginan
            "\n" +
            `❖ ${ctx.msg.bold("Bot")}: ${config.bot.name}\n` +
            `❖ ${ctx.msg.bold("Versi")}: ${pkg.version}\n` +
            `❖ ${ctx.msg.bold("Owner")}: ${config.owner.name}\n` +
            `❖ ${ctx.msg.bold("Mode")}: ${ctx.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
            `❖ ${ctx.msg.bold("Uptime")}: ${ctx.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
            `❖ ${ctx.msg.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
            `❖ ${ctx.msg.bold("Library")}: Baileys (${require("../../package.json").dependencies.baileys.includes(":") ? v.split(/:\/\/|:/).pop() : v.replace(/^[\^~]/, "")})`
        );
    }
};