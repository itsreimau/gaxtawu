module.exports = {
    name: "odemote",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.senderJid || (await ctx.getMentioned())[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
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