const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "opromote",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const accountJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah Owner grup!"));

        try {
            await ctx.group().promote(accountJid);

            await ctx.reply(formatter.quote("✅ Berhasil ditingkatkan dari anggota menjadi admin!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};