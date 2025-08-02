module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    code: async (ctx) => {
        return await ctx.reply({
            text: `${formatter.quote("ItsReimau (https://github.com/itsreimau)")}\n` +
                `${formatter.quote("Jastin Linggar Tama (https://github.com/JastinXyz)")}\n` +
                `${formatter.quote("YuPra Network (https://www.npmjs.com/~yupra)")}\n` +
                `${formatter.quote("Rippanteq7 (https://github.com/Rippanteq7)")}\n` +
                `${formatter.quote("Rizky Pratama (https://github.com/Kyluxx)")}\n` +
                `${formatter.quote("FandyAhmD (https://github.com/fandyahmd)")}\n` +
                formatter.quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini. (Banyak kalo diketik satu-satu)"),
            footer: config.msg.footer
        }); // Jika kamu tidak menghapus ini, terima kasih!
    }
};