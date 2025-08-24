const axios = require("axios");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    code: async (ctx) => {
        try {
            const latencyStart = performance.now();

            const downloadStart = performance.now();
            const downloadUrl = tools.api.createUrl("https://github.com", "/itsreimau/gaxtawu/raw/master/README.md");
            const downloadResponse = await axios.get(downloadUrl);
            const downloadSize = downloadResponse.headers["content-length"];
            const downloadTime = (performance.now() - downloadStart) / 1000;
            const downloadSpeed = downloadSize / downloadTime;

            const uploadStart = performance.now();
            const uploadData = Buffer.alloc(1024 * 1024);
            const uploadUrl = tools.api.createUrl("https://httpbin.org", "/post");
            const uploadResponse = await axios.post(uploadUrl, uploadData, {
                headers: {
                    "Content-Type": "application/octet-stream"
                }
            });
            const uploadTime = (performance.now() - uploadStart) / 1000;
            const uploadSpeed = uploadData.length / uploadTime;

            const latency = performance.now() - latencyStart;

            await ctx.reply({
                text: `${formatter.quote(`Latency: ${tools.msg.convertMsToDuration(latency)}`)}\n` +
                    `${formatter.quote(`Download: ${tools.msg.formatSizePerSecond(downloadSpeed)}`)}\n` +
                    formatter.quote(`Upload: ${tools.msg.formatSizePerSecond(uploadSpeed)}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};