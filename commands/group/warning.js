const { Baileys } = require("@itsreimau/gktw");

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
        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (accountJid === ctx.me.lid || accountJid === ctx.me.id) return await ctx.reply(`ⓘ ${formatter.italic(`Tidak bisa mengubah warning bot!`)}`);
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(`ⓘ ${formatter.italic("Tidak bisa memberikan warning ke Owner grup!")}`);

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];
            const targetJid = Baileys.isJidUser(accountJid) ? (await ctx.core.getLidUser(accountJid))?.[0].lid || accountJid : accountJid;

            const userWarning = warnings.find(warning => warning.jid === targetJid);

            let currentWarnings = userWarning ? userWarning.count : 0;
            const newWarning = currentWarnings + 1;

            if (userWarning) {
                userWarning.count = newWarning;
            } else {
                warnings.push({
                    jid: targetJid,
                    count: newWarning
                });
            }

            groupDb.warnings = warnings;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menambahkan warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};