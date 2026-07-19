const os = require("node:os");

module.exports = {
    name: "server",
    category: "information",
    code: async (ctx) => {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const cpus = os.cpus();

            await ctx.reply(
                `❖ ${ctx.msg.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `❖ ${ctx.msg.bold("Arch")}: ${os.arch()}\n` +
                `❖ ${ctx.msg.bold("Release")}: ${os.release()}\n` +
                `❖ ${ctx.msg.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Memori")}: ${ctx.msg.formatSize(usedMem)}\n` +
                `❖ ${ctx.msg.bold("Bebas")}: ${ctx.msg.formatSize(freeMem)}\n` +
                `❖ ${ctx.msg.bold("Total")}: ${ctx.msg.formatSize(totalMem)}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Model CPU")}: ${cpus[0].model}\n` +
                `❖ ${ctx.msg.bold("Kecepatan CPU")}: ${cpus[0].speed}\n` +
                `❖ ${ctx.msg.bold("Cores CPU")}: ${cpus.length}\n` +
                `❖ ${ctx.msg.bold("Muat Rata-Rata")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Versi NodeJS")}: ${process.version}\n` +
                `❖ ${ctx.msg.bold("Jalur Exec")}: ${process.execPath}\n` +
                `❖ ${ctx.msg.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `❖ ${ctx.msg.bold("Uptime")}: ${ctx.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `❖ ${ctx.msg.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
                `❖ ${ctx.msg.bold("Library")}: Baileys (${require("../../package.json").dependencies.baileys.includes(":") ? v.split(/:\/\/|:/).pop() : v.replace(/^[\^~]/, "")})`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};