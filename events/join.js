// Impor modul dan dependensi yang diperlukan
const { Baileys, Events } = require("@itsreimau/gktw");
const { styleText } = require("node:util");

module.exports = (bot) => {
    // Event saat bot menerima panggilan
    bot.ev.on(Events.GroupJoin, async (join) => {
        await ctx.sendMessage(join.id, {
            caption: `>ᴗ< ${formatter.italic(`Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)}`,
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: config.bot.name,
                address: "Jangan lupa berdonasi agar bot tetap online.",
                jpegThumbnail: await tools.cmd.getJpegThumbnail(config.bot.thumbnail)
            },
            buttons: [{
                text: "Menu",
                id: `${ctx.used.prefix}menu`
            }, {
                text: "Hubungi Owner",
                id: `${ctx.used.prefix}owner`
            }, {
                text: "Donasi",
                id: `${ctx.used.prefix}donate`
            }]
        });
    });
};