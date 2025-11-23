module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply({
            text: `ⓘ ${formatter.italic("Yakin ingin mereset database Anda? Tindakan ini akan menghapus semua data yang tersimpan dan tidak dapat dipulihkan.")}`,
            buttons: [{
                buttonId: "y",
                buttonText: {
                    displayText: "Ya"
                }
            }, {
                buttonId: "n",
                buttonText: {
                    displayText: "Tidak"
                }
            }]
        });

        try {
            ctx.awaitMessages({
                time: 60000
            }).then(async (collCtx) => {
                const text = collCtx.msg.text.trim().toLowerCase();

                if (text === "y") {
                    const usersDb = ctx.db.users;
                    usersDb.reset(user => user.jid === ctx.sender.jid);
                    await collCtx.reply(`ⓘ ${formatter.italic("Database Anda telah berhasil direset!")}`);
                    collector.stop();
                } else if (text === "n") {
                    await collCtx.reply(`ⓘ ${formatter.italic("Proses reset database telah dibatalkan.")}`);
                    collector.stop();
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};