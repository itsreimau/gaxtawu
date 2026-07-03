module.exports = {
    name: "getpp",
    aliases: ["geticon"],
    category: "misc",
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const result = await ctx.core.profilePictureUrl(target.jid);

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Akun")}: @${ctx.getId(target.jid)}`,
                mentions: [target.jid]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};