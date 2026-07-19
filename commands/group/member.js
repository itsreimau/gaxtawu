module.exports = [{
    name: "add",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["text"]);

        if (!target.jid)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "6281234567891")
            );

        const isOnWhatsApp = await ctx.core.onWhatsApp(target.jid);
        if (!isOnWhatsApp?.[0]?.exists) return await ctx.reply(ctx.msg.info("Akun tidak ada di WhatsApp!"));

        try {
            await ctx.group().add(target.jid);

            await ctx.reply(ctx.msg.info("Berhasil ditambahkan!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "kick",
    aliases: ["dor", "kik"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    ctx.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(ctx.msg.info("Dia adalah owner grup!"));

        try {
            await ctx.group().kick(target.jid);

            await ctx.reply(ctx.msg.info("Berhasil dikeluarkan!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];