module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply({
            text: formatter.quote(`🤖 Apakah kamu yakin ingin mereset datamu? Langkah ini akan menghapus seluruh data yang tersimpan dan tidak dapat dikembalikan.`),
            footer: config.msg.footer,
            buttons: [{
                    buttonId: `y`,
                    buttonText: {
                        displayText: "Ya"
                    }
                },
                {
                    buttonId: "n",
                    buttonText: {
                        displayText: "Tidak"
                    }
                }
            ]
        });

        try {
            ctx.awaitMessages({
                time: 60000
            }).then(async (m) => {
                const content = m.content.trim().toLowerCase();
                const senderId = ctx.getId(ctx.sender.jid);

                if (content === "y") {
                    await db.delete(`user.${senderId}`);
                    await ctx.reply(formatter.quote("✅ Data-mu berhasil direset, semua data telah dihapus!"));
                    return collector.stop();
                } else if (content === "n") {
                    await ctx.reply(formatter.quote("❌ Proses reset data telah dibatalkan."));
                    return collector.stop();
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};