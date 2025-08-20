module.exports = {
    name: "approve",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, ctx.getId(ctx.sender.jid)))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} all`)} untuk menyetujui semua anggota yang tertunda.`]))
        );

        const pendings = await ctx.group().pendingMembers();

        if (input.toLowerCase() === "all") {
            if (pendings.length === 0) return await ctx.reply(formatter.quote("✅ Tidak ada anggota yang menunggu persetujuan."));

            try {
                const allJids = pendings.map(pending => pending.jid);
                await ctx.group().approvePendingMembers(allJids);

                return await ctx.reply(formatter.quote(`✅ Berhasil menyetujui semua anggota (${allJids.length}).`));
            } catch (error) {
                return await tools.cmd.handleError(ctx, error);
            }
        }

        const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

        const isPending = pendings.some(pending => pending.jid === accountJid);
        if (!isPending) return await ctx.reply(formatter.quote("❎ Akun tidak ditemukan di daftar anggota yang menunggu persetujuan."));

        try {
            await ctx.group().approvePendingMembers([accountJid]);

            return await ctx.reply(formatter.quote("✅ Berhasil disetujui!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};