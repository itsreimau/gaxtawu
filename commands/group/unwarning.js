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

        if (accountJid === ctx.me.id || accountJid === ctx.me.lid) return await ctx.reply(formatter.quote(`❎ Tidak bisa mengubah warning bot!`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Tidak bisa mengubah warning admin grup!"));

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];

            const userWarning = warnings.find(warning => warning.userJid === accountJid);
            let currentWarnings = userWarning ? userWarning.count : 0;

            if (currentWarnings <= 0) return await ctx.reply(formatter.quote("✅ Pengguna itu tidak memiliki warning."));

            const newWarning = currentWarnings - 1;

            if (userWarning && newWarning <= 0) {
                groupDb.warning = warnings.filter(warning => warning.userJid !== accountJid)
            } else {
                userWarning.count = newWarning;
                groupDb.warning = warnings;
            }
            await groupDb.save();

            await ctx.reply(formatter.quote(`✅ Berhasil mengurangi warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};