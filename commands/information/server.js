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
                `❖ ${ctx.text.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `❖ ${ctx.text.bold("Arch")}: ${os.arch()}\n` +
                `❖ ${ctx.text.bold("Release")}: ${os.release()}\n` +
                `❖ ${ctx.text.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `❖ ${ctx.text.bold("Memori")}: ${ctx.text.formatSize(usedMem)}\n` +
                `❖ ${ctx.text.bold("Bebas")}: ${ctx.text.formatSize(freeMem)}\n` +
                `❖ ${ctx.text.bold("Total")}: ${ctx.text.formatSize(totalMem)}\n` +
                "\n" +
                `❖ ${ctx.text.bold("Model CPU")}: ${cpus[0].model}\n` +
                `❖ ${ctx.text.bold("Kecepatan CPU")}: ${cpus[0].speed}\n` +
                `❖ ${ctx.text.bold("Cores CPU")}: ${cpus.length}\n` +
                `❖ ${ctx.text.bold("Muat Rata-Rata")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `❖ ${ctx.text.bold("Versi NodeJS")}: ${process.version}\n` +
                `❖ ${ctx.text.bold("Jalur Exec")}: ${process.execPath}\n` +
                `❖ ${ctx.text.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `❖ ${ctx.text.bold("Uptime")}: ${ctx.text.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `❖ ${ctx.text.bold("Database")}: ${ctx.db.users.totalEntries} users, ${ctx.db.groups.totalEntries}/${Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id).length} groups\n` +
                `❖ ${ctx.text.bold("Library")}: Baileys (${require("../../package.json").dependencies.baileys.includes(":") ? v.split(/:\/\/|:/).pop() : v.replace(/^[\^~]/, "")})`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};