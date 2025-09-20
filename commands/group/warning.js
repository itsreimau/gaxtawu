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
        const accountJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        if (accountId === config.bot.lidId) return await ctx.reply(formatter.quote(`❎ Tidak bisa memberikan warning ke bot!`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Tidak bisa memberikan warning ke admin grup!"));

        try {
            const groupId = ctx.getId(ctx.id);
            const groupDb = await db.get(`group.${groupId}`) || {};
            const warnings = groupDb?.warnings || [];

            const userWarning = warnings.find(warning => warning.userId === accountId);
            let currentWarnings = userWarning ? userWarning.count : 0;
            const newWarning = currentWarnings + 1;

            if (userWarning) {
                userWarning.count = newWarning;
            } else {
                warnings.push({
                    userId: accountId,
                    count: newWarning
                });
            }

            await db.set(`group.${groupId}.warnings`, warnings);
            await ctx.reply(formatter.quote(`✅ Berhasil menambahkan warning pengguna itu menjadi ${newWarning}/${groupDb?.maxwarnings || 3}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};