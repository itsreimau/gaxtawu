const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "demote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.senderJid || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (!await ctx.group().isAdmin(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah anggota!"));

        try {
            await ctx.group().demote(accountJid);

            await ctx.reply(formatter.quote("✅ Berhasil diturunkan dari admin menjadi anggota!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};