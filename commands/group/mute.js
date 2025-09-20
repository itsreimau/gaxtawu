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
        const groupId = ctx.getId(ctx.id);

        if (ctx.args[0]?.toLowerCase() === "bot") {
            await db.set(`group.${groupId}.mutebot`, true);
            return await ctx.reply(formatter.quote("✅ Berhasil me-mute grup ini dari bot!"));
        }

        const accountJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`])),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        if (accountId === config.bot.lidId) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`));
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