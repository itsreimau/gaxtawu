const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "omute",
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const groupId = ctx.getId(ctx.id);

        if (ctx.args[0]?.toLowerCase() === "bot") {
            await db.set(`group.${groupId}.mutebot`, "owner");
            return await ctx.reply(formatter.quote("✅ Berhasil me-mute grup ini dari bot!"));
        }

        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(Baileys.OFFICIAL_BIZ_JID)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`])),
            mentions: [Baileys.OFFICIAL_BIZ_JID]
        });

        if (accountId === ctx.me.id) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah Owner grup!"));

        try {
            const muteList = await db.get(`group.${groupId}.mute`) || [];
            if (!muteList.includes(accountId)) muteList.push(accountId);
            await db.set(`group.${groupId}.mute`, muteList);

            await ctx.reply(formatter.quote("✅ Berhasil me-mute pengguna itu dari grup ini!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};