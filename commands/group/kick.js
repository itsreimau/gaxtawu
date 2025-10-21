module.exports = {
    name: "kick",
    aliases: ["dor", "kik"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(`ⓘ ${formatter.italic("Dia adalah Owner grup!")}`);

        try {
            await ctx.group().kick(accountJid);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil dikeluarkan!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};