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

        const accountJid = ctx.quoted?.senderJid || await tools.cmd.getJidFromLid(ctx.getMentioned()[0]) || null;
        const accountId = ctx.getId(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`])),
            mentions: [ctx.sender.jid]
        });

        if (accountId === config.bot.id) return await ctx.reply(formatter.quote(`❎ Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`));
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah owner grup!"));

        try {
            let muteList = await db.get(`group.${groupId}.mute`) || [];
            muteList = muteList.filter(mute => mute !== accountId);
            await db.set(`group.${groupId}.mute`, muteList);

            return await ctx.reply(formatter.quote("✅ Berhasil me-unmute pengguna itu dari grup ini!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};