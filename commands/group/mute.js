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
            return await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-mute grup ini dari bot!")}`);
        }

        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target.",
                        `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (target === ctx.me.lid) return await ctx.reply(`ⓘ ${formatter.italic(`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`)}`);
        if (await ctx.group().isOwner(target)) return await ctx.reply(`ⓘ ${formatter.italic("Dia adalah owner grup!")}`);

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const isAlreadyMuted = muteList.includes(target);
            if (isAlreadyMuted) return await ctx.reply(`ⓘ ${formatter.italic("Pengguna sudah di-mute sebelumnya!")}`);

            muteList.push(target);
            groupDb.mute = muteList;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-mute pengguna itu dari grup ini!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};