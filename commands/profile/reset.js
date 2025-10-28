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
            }).then(async (m) => {
                const content = m.content.trim().toLowerCase();

                if (content === "y") {
                    const usersDb = ctx.db.users;
                    usersDb.reset(user => user.jid === ctx.sender.jid || user.alt === ctx.sender.jid);
                    await ctx.reply(`ⓘ ${formatter.italic("Database Anda telah berhasil direset!")}`);
                    collector.stop();
                } else if (content === "n") {
                    await ctx.reply(`ⓘ ${formatter.italic("Proses reset database telah dibatalkan.")}`);
                    collector.stop();
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};