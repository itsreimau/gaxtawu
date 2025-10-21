module.exports = {
    name: "demote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (!await ctx.group().isAdmin(accountJid)) return await ctx.reply(`ⓘ ${formatter.italic("Dia adalah anggota!")}`);

        try {
            await ctx.group().demote(accountJid);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil diturunkan dari admin menjadi anggota!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};