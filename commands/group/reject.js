module.exports = {
    name: "reject",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "all") {
            const pendings = await ctx.group().pendingMembers();
            if (pendings.length === 0) return await ctx.reply(`ⓘ ${formatter.italic("Tidak ada anggota yang menunggu persetujuan.")}`);

            try {
                const allJids = pendings.map(pending => pending.jid);
                await ctx.group().rejectPendingMembers(allJids);

                return await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menolak semua anggota (${allJids.length}).`)}`);
            } catch (error) {
                return await tools.cmd.handleError(ctx, error);
            }
        }

        const target = await ctx.target(["text"]);

        if (!target)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "6281234567891")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} all`)} untuk menolak semua anggota yang tertunda.`
                ])
            );

        const pendings = await ctx.group().pendingMembers();
        const isPending = pendings.some(pending => pending.jid === target);
        if (!isPending) return await ctx.reply(`ⓘ ${formatter.italic("Akun tidak ditemukan di daftar anggota yang menunggu persetujuan.")}`);

        try {
            await ctx.group().rejectPendingMembers(target);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil ditolak!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};