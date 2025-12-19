module.exports = {
    name: "unbanuser",
    aliases: ["ubu", "unban"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target);
            targetDb.banned = false;
            targetDb.save();

            const flag = ctx.flag({
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            if (!silent)
                await ctx.core.sendMessage(target, {
                    text: `ⓘ ${formatter.italic("Anda telah diunbanned oleh owner!")}`
                });

            await ctx.reply(` ⓘ ${formatter.italic("Berhasil diunbanned!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};