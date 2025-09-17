module.exports = {
    name: "promote",
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
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
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