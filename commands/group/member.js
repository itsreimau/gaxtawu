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
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "6281234567891")
            );

        const isOnWhatsApp = await ctx.core.onWhatsApp(target.jid);
        if (!isOnWhatsApp?.[0]?.exists) return await ctx.reply(tools.msg.info("Akun tidak ada di WhatsApp!"));

        try {
            await ctx.group().add(target.jid);

            await ctx.reply(tools.msg.info("Berhasil ditambahkan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
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
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("Dia adalah owner grup!"));

        try {
            await ctx.group().kick(target.jid);

            await ctx.reply(tools.msg.info("Berhasil dikeluarkan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
}];