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
                `❖ ${tools.msg.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `❖ ${tools.msg.bold("Arch")}: ${os.arch()}\n` +
                `❖ ${tools.msg.bold("Release")}: ${os.release()}\n` +
                `❖ ${tools.msg.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `❖ ${tools.msg.bold("Memori")}: ${tools.msg.formatSize(usedMem)}\n` +
                `❖ ${tools.msg.bold("Bebas")}: ${tools.msg.formatSize(freeMem)}\n` +
                `❖ ${tools.msg.bold("Total")}: ${tools.msg.formatSize(totalMem)}\n` +
                "\n" +
                `❖ ${tools.msg.bold("Model CPU")}: ${cpus[0].model}\n` +
                `❖ ${tools.msg.bold("Kecepatan CPU")}: ${cpus[0].speed}\n` +
                `❖ ${tools.msg.bold("Cores CPU")}: ${cpus.length}\n` +
                `❖ ${tools.msg.bold("Muat Rata-Rata")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `❖ ${tools.msg.bold("Versi NodeJS")}: ${process.version}\n` +
                `❖ ${tools.msg.bold("Jalur Exec")}: ${process.execPath}\n` +
                `❖ ${tools.msg.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `❖ ${tools.msg.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `❖ ${tools.msg.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
                `❖ ${tools.msg.bold("Library")}: #engine (Fork of @mengkodingan/ckptw)`
            );
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};