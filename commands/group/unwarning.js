const { Baileys } = require("@itsreimau/gktw");

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
        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (accountJid === ctx.me.lid || accountJid === ctx.me.id) return await ctx.reply(formatter.quote(`❎ Tidak bisa mengubah warning bot!`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Tidak bisa memberikan warning ke Owner grup!"));

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];
            const targetJid = Baileys.isJidUser(accountJid) ? (await ctx.core.getLidUser(accountJid))?.[0].lid || accountJid : accountJid;

            const userWarning = warnings.find(warning => warning.jid === targetJid);
            let currentWarnings = userWarning ? userWarning.count : 0;

            if (currentWarnings <= 0) return await ctx.reply(formatter.quote("✅ Pengguna itu tidak memiliki warning."));

            const newWarning = currentWarnings - 1;
            if (userWarning && newWarning <= 0) {
                groupDb.warnings = warnings.filter(warning => warning.jid !== targetJid);
            } else {
                userWarning.count = newWarning;
            }

            groupDb.save();

            await ctx.reply(formatter.quote(`✅ Berhasil mengurangi warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};