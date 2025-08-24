module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "information",
    code: async (ctx) => {
        await ctx.reply({
            text: formatter.quote("https://github.com/itsreimau/gaxtawu"),
            footer: config.msg.footer
        }); // Jika kamu tidak menghapus ini, terima kasih!
    }
};