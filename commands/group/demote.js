module.exports = {
    name: "demote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.senderJid || await tools.cmd.getJidFromLid(ctx.getMentioned()[0]) || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (!await ctx.group().isAdmin(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah anggota!"));

        try {
            await ctx.group().demote([accountJid]);

            return await ctx.reply(formatter.quote("✅ Berhasil diturunkan dari admin menjadi anggota!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};