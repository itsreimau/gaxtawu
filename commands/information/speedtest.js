const axios = require("axios");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    code: async (ctx) => {
        try {
            const latencyStart = performance.now();

            const downloadStart = performance.now();
            const downloadResponse = await axios.get(tools.api.createUrl("https://github.com", "/itsreimau/gaxtawu/raw/master/README.md"));
            const downloadSize = downloadResponse.headers["content-length"];
            const downloadTime = (performance.now() - downloadStart) / 1000;
            const downloadSpeed = downloadSize / downloadTime;

            const uploadStart = performance.now();
            const uploadData = Buffer.alloc(1024 * 1024);
            const uploadResponse = await axios.post(tools.api.createUrl("https://httpbin.org", "/post"), uploadData, {
                headers: {
                    "Content-Type": "application/octet-stream"
                }
            });
            const uploadTime = (performance.now() - uploadStart) / 1000;
            const uploadSpeed = uploadData.length / uploadTime;

            const latencySpeeed = performance.now() - latencyStart;

            await ctx.reply(
                `➛ ${formatter.bold("Latency")}: ${tools.msg.convertMsToDuration(latencySpeeed)}\n` +
                `➛ ${formatter.bold("Download")}: ${tools.msg.formatSize(downloadSpeed, true)}\n` +
                `➛ ${formatter.bold("Upload")}: ${tools.msg.formatSize(uploadSpeed, true)}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};