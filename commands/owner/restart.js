const {
    exec
} = require("node:child_process");
const process = require("node:process");
const util = require("node:util");

module.exports = {
    name: "restart",
    aliases: ["r"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!process.env.PM2_HOME) return await ctx.reply(formatter.quote("❎ Bot tidak berjalan di bawah PM2! Restart manual diperlukan."));

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            await db.set("bot.restart", {
                jid: ctx.id,
                key: waitMsg.key,
                timestamp: Date.now()
            });

            await util.promisify(exec)("pm2 restart $(basename $(pwd))"); // Hanya berfungsi saat menggunakan PM2
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};