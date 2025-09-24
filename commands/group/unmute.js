const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "unmute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const groupId = ctx.getId(ctx.id);

        if (ctx.args[0]?.toLowerCase() === "bot") {
            await db.set(`group.${groupId}.mutebot`, false);
            return await ctx.reply(formatter.quote("✅ Berhasil me-unmute grup ini dari bot!"));
        }

        const accountJid = await ctx.quoted?.sender || await ctx.getLIDForPN(ctx.getMentioned()[0]) || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (accountId === ctx.me.id) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah Owner grup!"));

        try {
            let muteList = await db.get(`group.${groupId}.mute`) || [];
            muteList = muteList.filter(mute => mute !== accountId);
            await db.set(`group.${groupId}.mute`, muteList);

            await ctx.reply(formatter.quote("✅ Berhasil me-unmute pengguna itu dari grup ini!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};