const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "mute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const groupDb = ctx.db.group;

        if (ctx.args[0]?.toLowerCase() === "bot") {
            groupDb.mutebot = true;
            await groupDb.save();
            return await ctx.reply(formatter.quote("✅ Berhasil me-mute grup ini dari bot!"));
        }

        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (accountJid === ctx.me.id || accountJid === ctx.me.lid) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah Owner grup!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const isAlreadyMuted = muteList.some(user => (user.jid && user.jid === accountJid) || (user.alt && user.alt === accountJid));
            if (isAlreadyMuted) return await ctx.reply(formatter.quote("❎ Pengguna sudah di-mute sebelumnya!"));

            const muteData = Baileys.isLidUser(accountJid) ? {
                jid: accountJid
            } : {
                alt: accountJid
            };
            muteList.push(muteData);
            groupDb.mute = muteList;
            await groupDb.save();

            await ctx.reply(formatter.quote("✅ Berhasil me-mute pengguna itu dari grup ini!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};