const { SpeedTestService } = require("@ginkohub/speedtest-js");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    code: async (ctx) => {
        try {
            const service = new SpeedTestService();
            await service.fetchClientInfo();
            const bestServer = await service.findBestServer();
            const latencySpeed = (await service.testLatency(bestServer, 5)).latency;
            const downloadSpeed = await service.testDownload(bestServer, null, {
                threads: 4,
                duration: 10000
            });
            const uploadSpeed = await service.testUpload(bestServer, null, {
                duration: 10000
            });

            await ctx.reply(
                `➛ ${formatter.bold("Latency")}: ${tools.msg.convertMsToDuration(latencySpeed)}\n` +
                `➛ ${formatter.bold("Download")}: ${tools.msg.formatSize(downloadSpeed, true)}\n` +
                `➛ ${formatter.bold("Upload")}: ${tools.msg.formatSize(uploadSpeed, true)}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};