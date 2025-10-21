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
        const groupDb = ctx.db.group;

        if (ctx.args[0]?.toLowerCase() === "bot") {
            groupDb.mutebot = false;
            await groupDb.save();
            return await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-unmute grup ini dari bot!")}`);
        }

        const accountJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (accountJid === ctx.me.lid || accountJid === ctx.me.id) return await ctx.reply(`ⓘ ${formatter.italic(`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`)}`);
        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(`ⓘ ${formatter.italic("Dia adalah Owner grup!")}`);

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];
            const targetJid = Baileys.isJidUser(accountJid) ? (await ctx.core.getLidUser(accountJid))?.[0].lid || accountJid : accountJid;

            const index = muteList.indexOf(targetJid);
            if (index === -1) return await ctx.reply(`ⓘ ${formatter.italic("Pengguna tidak ditemukan dalam daftar mute!")}`);

            muteList.splice(index, 1);
            groupDb.mute = muteList;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-unmute pengguna itu dari grup ini!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};