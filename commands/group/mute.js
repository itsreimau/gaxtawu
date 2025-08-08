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

        const accountJid = ctx?.quoted?.senderJid || ctx.getMentioned()[0] || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`])),
            mentions: [ctx.sender.jid]
        });

        if (accountId === config.bot.id) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah owner grup!"));

        try {
            const muteList = await db.get(`group.${groupId}.mute`) || [];
            if (!muteList.includes(accountId)) muteList.push(accountId);
            await db.set(`group.${groupId}.mute`, muteList);

            return await ctx.reply(formatter.quote("✅ Berhasil me-mute pengguna itu dari grup ini!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};