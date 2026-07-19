const { SpeedTestService } = require("@ginkohub/speedtest-js");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    code: async (ctx) => {
        try {
            const speedtestMsg = await ctx.reply(ctx.msg.info("Memulai speedtest..."));

            await ctx.editMessage(ctx.id, speedtestMsg.key, ctx.msg.info("Mengambil informasi client..."));
            const service = new SpeedTestService();
            await service.fetchClientInfo();

            await ctx.editMessage(ctx.id, speedtestMsg.key, ctx.msg.info("Mencari server terbaik..."));
            const bestServer = await service.findBestServer();

            await ctx.editMessage(ctx.id, speedtestMsg.key, ctx.msg.info("Menguji latency..."));
            const latencySpeed = (await service.testLatency(bestServer, 5)).latency;

            await ctx.editMessage(ctx.id, speedtestMsg.key, ctx.msg.info("Menguji kecepatan download..."));
            const downloadSpeed = await service.testDownload(bestServer, null, {
                threads: 4,
                duration: 10000
            });

            await ctx.editMessage(ctx.id, speedtestMsg.key, ctx.msg.info("Menguji kecepatan upload..."));
            const uploadSpeed = await service.testUpload(bestServer, null, {
                duration: 10000
            });

            await ctx.editMessage(ctx.id, speedtestMsg.key,
                `❖ ${ctx.msg.bold("Latency")}: ${ctx.msg.convertMsToDuration(latencySpeed)}\n` +
                `❖ ${ctx.msg.bold("Download")}: ${ctx.msg.formatSize(downloadSpeed, true)}\n` +
                `❖ ${ctx.msg.bold("Upload")}: ${ctx.msg.formatSize(uploadSpeed, true)}`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};