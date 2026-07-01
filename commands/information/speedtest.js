const { SpeedTestService } = require("@ginkohub/speedtest-js");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    code: async (ctx) => {
        try {
            const speedtestMsg = await ctx.reply(tools.msg.info("Memulai speedtest..."));

            await ctx.editMessage(ctx.id, speedtestMsg.key, tools.msg.info("Mengambil informasi client..."));
            const service = new SpeedTestService();
            await service.fetchClientInfo();

            await ctx.editMessage(ctx.id, speedtestMsg.key, tools.msg.info("Mencari server terbaik..."));
            const bestServer = await service.findBestServer();

            await ctx.editMessage(ctx.id, speedtestMsg.key, tools.msg.info("Menguji latency..."));
            const latencySpeed = (await service.testLatency(bestServer, 5)).latency;

            await ctx.editMessage(ctx.id, speedtestMsg.key, tools.msg.info("Menguji kecepatan download..."));
            const downloadSpeed = await service.testDownload(bestServer, null, {
                threads: 4,
                duration: 10000
            });

            await ctx.editMessage(ctx.id, speedtestMsg.key, tools.msg.info("Menguji kecepatan upload..."));
            const uploadSpeed = await service.testUpload(bestServer, null, {
                duration: 10000
            });

            await ctx.editMessage(ctx.id, speedtestMsg.key,
                `❖ ${formatter.bold("Latency")}: ${tools.msg.convertMsToDuration(latencySpeed)}\n` +
                `❖ ${formatter.bold("Download")}: ${tools.msg.formatSize(downloadSpeed, true)}\n` +
                `❖ ${formatter.bold("Upload")}: ${tools.msg.formatSize(uploadSpeed, true)}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};