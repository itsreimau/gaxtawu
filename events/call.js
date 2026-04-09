const { Baileys, Events } = require("@itsreimau/gktw");

module.exports = (bot) => {
    bot.ev.on(Events.Call, async (call) => {
        if (!config.system.antiCall || call.status !== "offer") return;

        const fromJid = call.from;
        const fromId = bot.getId(fromJid);
        const isOwner = bot.checkOwner(fromJid);
        const fromDb = bot.getDb("users", fromJid);

        if (call?.isGroup || isOwner || fromDb?.banned) return;

        consolefy.info(`Incoming call from: ${bot.getId(call.callerPn)}`);

        await bot.core.rejectCall(call.id, fromJid);

        fromDb.banned = true;
        fromDb.save();

        const reportOwner = tools.cmd.getReportOwner();
        if (reportOwner && reportOwner.length > 0) {
            for (const ownerId of reportOwner) {
                await bot.sendMessage(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: `ⓘ ${formatter.italic(`Akun @${fromId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`)}`,
                    mentions: [fromJid]
                });
                await tools.cmd.delay(500);
            }
        }

        await bot.sendMessage(fromJid, {
            text: `ⓘ ${formatter.italic("Anda telah dibanned secara otomatis karena melanggar aturan!")}`,
            buttons: [{
                buttonId: "/owner",
                buttonText: {
                    displayText: "Hubungi Owner"
                }
            }]
        });
    });
};
