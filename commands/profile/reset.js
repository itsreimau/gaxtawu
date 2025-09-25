module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply({
            text: formatter.quote(`🤖 Yakin ingin mereset database Anda? Tindakan ini akan menghapus semua data yang tersimpan dan tidak dapat dipulihkan.`),
            footer: config.msg.footer,
            buttons: [{
                buttonId: `y`,
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
                    await db.delete(`user.${ctx.keyDb.user}`);
                    await ctx.reply(formatter.quote("✅ Database Anda telah berhasil direset!"));
                    collector.stop();
                } else if (content === "n") {
                    await ctx.reply(formatter.quote("❌ Proses reset data telah dibatalkan."));
                    collector.stop();
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};