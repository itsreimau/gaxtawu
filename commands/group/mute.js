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
            return await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-mute grup ini dari bot!")}`);
        }

        const targetJid = ctx.quoted?.sender || ctx.getMentioned()[0] || null;

        if (!targetJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`]),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (targetJid === ctx.me.lid || targetJid === ctx.me.id) return await ctx.reply(`ⓘ ${formatter.italic(`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`)}`);
        if (await ctx.group().isOwner(targetJid)) return await ctx.reply(`ⓘ ${formatter.italic("Dia adalah owner grup!")}`);

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];
            const targetJid = Baileys.isJidUser(targetJid) ? (await ctx.core.getLidUser(targetJid))?.[0].lid || targetJid : targetJid;

            const isAlreadyMuted = muteList.includes(targetJid);
            if (isAlreadyMuted) return await ctx.reply(`ⓘ ${formatter.italic("Pengguna sudah di-mute sebelumnya!")}`);

            muteList.push(targetJid);
            groupDb.mute = muteList;
            groupDb.save();

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil me-mute pengguna itu dari grup ini!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};