const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "add",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "6281234567891")
        );

        const targetJid = input.replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET;

        const isOnWhatsApp = await ctx.core.onWhatsApp(targetJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(`ⓘ ${formatter.italic("Akun tidak ada di WhatsApp!")}`);

        try {
            await ctx.group().add(targetJid);

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil ditambahkan!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};