const { Events } = require("@itsreimau/gktw");

module.exports = (bot) => {
    bot.ev.once(Events.ClientReady, async (b) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${b.user?.id || b.user?.lid}`);

        const botDb = bot.getDb("bot");
        const botRestart = botDb?.restart || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.sendMessage(botRestart.jid, {
                text: `ⓘ ${formatter.italic(`Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`)}`,
                edit: botRestart.key
            });
            delete botDb.restart;
            botDb.save();
        }

        const groupLink = `https://chat.whatsapp.com/${config.bot?.groupJid ? await b.groupInviteCode(config.bot.groupJid).catch(() => "FxEYZl2UyzAEI2yhaH34Ye") : "FxEYZl2UyzAEI2yhaH34Ye"}`;
        if (!config.bot.groupLink || config.bot.groupLink !== groupLink) config.core.set("bot.groupLink", groupLink);
    });
};
