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
        const accountJid = await ctx.quoted?.sender || await ctx.getLIDForPN(ctx.getMentioned()[0]) || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (accountId === ctx.me.id) return await ctx.reply(formatter.quote(`❎ Tidak bisa mengubah warning bot!`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Tidak bisa mengubah warning admin grup!"));

        try {
            const groupId = ctx.getId(ctx.id);
            const groupDb = await db.get(`group.${groupId}`) || {};
            const warnings = groupDb?.warnings || [];

            const userWarning = warnings.find(warning => warning.userId === accountId);
            let currentWarnings = userWarning ? userWarning.count : 0;

            if (currentWarnings <= 0) return await ctx.reply(formatter.quote("✅ Pengguna itu tidak memiliki warning."));

            const newWarning = currentWarnings - 1;

            if (userWarning && newWarning <= 0) {
                await db.set(`group.${groupId}.warnings`, warnings.filter(warning => warning.userId !== accountId));
            } else {
                userWarning.count = newWarning;
                await db.set(`group.${groupId}.warnings`, warnings);
            }

            await ctx.reply(formatter.quote(`✅ Berhasil mengurangi warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};