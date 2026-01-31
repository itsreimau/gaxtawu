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
            const maxWarnings = groupDb?.maxwarnings || 3;

            const targetIndex = warnings.findIndex(warning => warning.jid === target);

            if (targetIndex === -1) return await ctx.reply(`ⓘ ${formatter.italic("Pengguna tidak memiliki warning.")}`);

            const currentCount = warnings[targetIndex].count || 0;

            if (currentCount <= 0) {
                warnings.splice(targetIndex, 1);
                groupDb.warnings = warnings;
                groupDb.save();
                return await ctx.reply(`ⓘ ${formatter.italic("Pengguna tidak memiliki warning.")}`);
            }

            const newWarningCount = currentCount - 1;

            if (newWarningCount <= 0) {
                warnings.splice(targetIndex, 1);
            } else {
                warnings[targetIndex].count = newWarningCount;
            }

            groupDb.warnings = warnings;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil mengurangi warning menjadi ${newWarningCount}/${maxWarnings}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};