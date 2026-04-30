const { exec } = require("node:child_process");

module.exports = {
    name: "restart",
    aliases: ["r"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!process.env.PM2_HOME) return await ctx.reply(tools.msg.info("Bot tidak berjalan di bawah PM2! Restart manual diperlukan."));

        try {
            const waitMsg = await ctx.reply(tools.msg.info(config.msg.wait));
            const botDb = ctx.db.bot;
            botDb.restart = {
                jid: ctx.id,
                key: waitMsg.key,
                timestamp: Date.now()
            };
            botDb.save();

            exec("pm2 restart $(basename $(pwd))"); // Hanya berfungsi saat menggunakan PM2
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};