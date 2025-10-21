const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

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
                `➛ ${formatter.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `➛ ${formatter.bold("Arch")}: ${os.arch()}\n` +
                `➛ ${formatter.bold("Release")}: ${os.release()}\n` +
                `➛ ${formatter.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `➛ ${formatter.bold("Memori")}: ${tools.msg.formatSize(usedMem)}\n` +
                `➛ ${formatter.bold("Bebas")}: ${tools.msg.formatSize(freeMem)}\n` +
                `➛ ${formatter.bold("Total")}: ${tools.msg.formatSize(totalMem)}\n` +
                "\n" +
                `➛ ${formatter.bold("Model CPU")}: ${cpus[0].model}\n` +
                `➛ ${formatter.bold("Kecepatan CPU")}: ${cpus[0].speed}\n` +
                `➛ ${formatter.bold("Cores CPU")}: ${cpus.length}\n` +
                `➛ ${formatter.bold("Muat Rata-Rata")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `➛ ${formatter.bold("Versi NodeJS")}: ${process.version}\n` +
                `➛ ${formatter.bold("Jalur Exec")}: ${process.execPath}\n` +
                `➛ ${formatter.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
                `➛ ${formatter.bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};