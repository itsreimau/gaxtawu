module.exports = {
    name: "warning",
    aliases: ["warn"],
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

            let newWarningCount;

            if (targetIndex !== -1) {
                warnings[targetIndex].count += 1;
                newWarningCount = warnings[targetIndex].count;
            } else {
                newWarningCount = 1;
                warnings.push({
                    jid: target,
                    count: newWarningCount
                });
            }

            groupDb.warnings = warnings;
            groupDb.save();

            if (newWarningCount >= maxWarnings) {
                await ctx.reply(`ⓘ ${formatter.italic(`Pengguna mencapai batas warning (${newWarningCount}/${maxWarnings}).`)}`);
                await ctx.group().kick(target);
                groupDb.warnings = warnings.filter(warning => warning.jid !== target);
            } else {
                await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menambahkan warning menjadi ${newWarningCount}/${maxWarnings}.`)}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};