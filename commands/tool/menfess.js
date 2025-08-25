const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "menfess",
    aliases: ["conf", "confes", "confess", "menf", "menfes"],
    category: "tool",
    permissions: {
        coin: 10,
        private: true
    },
    code: async (ctx) => {
        const [id, ...text] = ctx.args;
        const targetId = id ? id.replace(/[^\d]/g, "") : null;
        const menfessText = text ? text.join(" ") : null;

        const senderId = ctx.getId(ctx.sender.jid);

        if (!targetId && !menfessText) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `${senderId} halo, dunia!`))}\n` +
            formatter.quote(tools.msg.generateNotes(["Jangan gunakan spasi pada angka. Contoh: +62 8123-4567-8910, seharusnya +628123-4567-8910"]))
        );

        if (targetId === config.bot.id) return await ctx.reply(formatter.quote("❎ Tidak dapat digunakan pada bot."));
        if (targetId === senderId) return await ctx.reply(formatter.quote("❎ Tidak dapat digunakan pada diri sendiri."));

        const allMenfessDb = await db.get("menfess") || {};
        if (Object.values(allMenfessDb).some(menfess => menfess.from === senderId || menfess.to === senderId)) return await ctx.reply(formatter.quote("❎ Kamu tidak dapat mengirim menfess karena sedang terlibat dalam percakapan lain."));
        if (Object.values(allMenfessDb).some(menfess => menfess.from === targetId || menfess.to === targetId)) return await ctx.reply(formatter.quote("❎ Kamu tidak dapat mengirim menfess, karena dia sedang terlibat dalam percakapan lain."));

        try {
            const buttons = [{
                buttonId: "delete",
                buttonText: {
                    displayText: "Hapus Menfess"
                }
            }];

            await ctx.sendMessage(targetId + Baileys.S_WHATSAPP_NET, {
                text: menfessText,
                footer: formatter.italic(`Setiap pesan yang kamu kirim akan diteruskan ke orang tersebut!`),
                buttons
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText("Seseorang telah mengirimi-mu menfess.")
            });
            await db.set(`menfess.${Date.now()}`, {
                from: senderId,
                to: targetId
            });

            await ctx.reply({
                text: formatter.quote(`✅ Pesan berhasil terkirim!`),
                footer: config.msg.footer,
                buttons
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};