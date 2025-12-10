module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        const input = ctx.args[0] || null;

        try {
            if (input === "y") {
                const usersDb = ctx.db.users;
                usersDb.reset(user => user.jid === ctx.sender.jid);
                return await collCtx.reply(`ⓘ ${formatter.italic("Database Anda telah berhasil direset!")}`);
            } else if (input === "n") {
                return await collCtx.reply(`ⓘ ${formatter.italic("Proses reset database telah dibatalkan.")}`);
            }

            await ctx.reply({
                text: `ⓘ ${formatter.italic("Yakin ingin mereset database Anda? Tindakan ini akan menghapus semua data yang tersimpan dan tidak dapat dipulihkan.")}`,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} yes`,
                    buttonText: {
                        displayText: "Ya"
                    }
                }, {
                    buttonId: `${ctx.used.prefix + ctx.used.command} no`,
                    buttonText: {
                        displayText: "Tidak"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};