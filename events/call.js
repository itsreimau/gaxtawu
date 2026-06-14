// Impor modul dan dependensi yang diperlukan
const { Baileys, Events } = require("@itsreimau/gktw");
const { styleText } = require("node:util");

module.exports = (bot) => {
    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (call) => {
        if (!config.system.antiCall || call.status !== "offer") return;

        const fromJid = call.from;
        const fromId = bot.getId(fromJid);
        const isOwner = bot.checkOwner(fromJid);
        const fromDb = bot.getDb("users", fromJid);

        if (call?.isGroup || isOwner || fromDb?.banned) return;

        const fromPnJid = call.callerPn;
        const fromPnId = bot.getId(fromPnJid);

        console.log(styleText("cyan", `Incoming call from: ${fromPnJid}`)); // Log panggilan masuk

        await bot.core.rejectCall(call.id, fromJid);

        fromDb.banned = true;
        fromDb.save();

        const reportOwner = tools.cmd.getReportOwner();
        if (reportOwner && reportOwner.length > 0) {
            const {
                delay
            } = tools.cmd.calculateDelay(reportOwner.length);
            for (const ownerId of reportOwner) {
                await bot.sendMessage(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: tools.msg.info(`Akun @${fromPnId} telah dibanned secara otomatis karena alasan ${formatter.inlineCode("Anti Call")}.`),
                    mentions: [fromPnJid]
                });
                await tools.cmd.delay(delay);
            }
        }
        await bot.sendMessage(fromJid, {
            text: tools.msg.info("Anda telah dibanned secara otomatis karena melanggar aturan!"),
            buttons: [{
                text: "Hubungi Owner",
                id: "/owner"
            }]
        });
    });
};