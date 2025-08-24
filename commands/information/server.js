const os = require("node:os");
const process = require("node:process");

module.exports = {
    name: "server",
    category: "information",
    code: async (ctx) => {
        try {
            const startTime = config.bot.readyAt;
            const memory = process.memoryUsage();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const uptimeOS = os.uptime() * 1000;
            const load = os.loadavg();
            const cpus = os.cpus();

            await ctx.reply({
                text: `${formatter.quote(`OS: ${os.type()} (${os.platform()})`)}\n` +
                    `${formatter.quote(`Arch: ${os.arch()}`)}\n` +
                    `${formatter.quote(`Release: ${os.release()}`)}\n` +
                    `${formatter.quote(`Hostname: ${os.hostname()}`)}\n` +
                    `${formatter.quote(`System Uptime: ${tools.msg.convertMsToDuration(uptimeOS)}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Digunakan: ${tools.msg.formatSize(usedMem)}`)}\n` +
                    `${formatter.quote(`Bebas: ${tools.msg.formatSize(freeMem)}`)}\n` +
                    `${formatter.quote(`Total: ${tools.msg.formatSize(totalMem)}`)}\n` +
                    `${formatter.quote(`Memori Aplikasi (RSS): ${tools.msg.formatSize(memory.rss)}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Model: ${cpus[0].model}`)}\n` +
                    `${formatter.quote(`Kecepatan: ${cpus[0].speed} MHz`)}\n` +
                    `${formatter.quote(`Cores: ${cpus.length}`)}\n` +
                    `${formatter.quote(`Muat Rata-Rata: ${load.map(avg => avg.toFixed(2)).join(", ")}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Versi NodeJS: ${process.version}`)}\n` +
                    `${formatter.quote(`Platform: ${process.platform}`)}\n` +
                    `${formatter.quote(`Jalur Exec: ${process.execPath}`)}\n` +
                    `${formatter.quote(`PID: ${process.pid}`)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                    `${formatter.quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                    formatter.quote("Library: @itsreimau/gktw (Fork of @mengkodingan/ckptw)"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};