const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "okick",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = await ctx.quoted?.senderLid() || await Baileys.getLIDForPN(ctx.getMentioned()[0]) || null;

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0"))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        if (await ctx.group().isOwner(accountJid)) return await ctx.reply(formatter.quote("❎ Dia adalah Owner grup!"));

        try {
            await ctx.group().kick(accountJid);

            await ctx.reply(formatter.quote("✅ Berhasil dikeluarkan!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};