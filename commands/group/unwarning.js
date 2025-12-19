module.exports = {
    name: "unwarning",
    aliases: ["unwarn"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (target === ctx.me.lid) return await ctx.reply(`ⓘ ${formatter.italic(`Tidak bisa mengubah warning bot!`)}`);
        if (await ctx.group().isOwner(target)) return await ctx.reply(`ⓘ ${formatter.italic("Tidak bisa memberikan warning ke owner grup!")}`);

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];

            const targetWarning = warnings.find(warning => warning.jid === target);
            let currentWarnings = targetWarning ? targetWarning.count : 0;

            if (currentWarnings <= 0) return await ctx.reply(`ⓘ ${formatter.italic("Pengguna itu tidak memiliki warning.")}`);

            const newWarning = currentWarnings - 1;
            if (targetWarning && newWarning <= 0) {
                groupDb.warnings = warnings.filter(warning => warning.jid !== target);
            } else {
                targetWarning.count = newWarning;
            }

            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil mengurangi warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};