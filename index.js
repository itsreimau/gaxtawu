require("node:process").loadEnvFile();
const { Config, Formatter } = require("@itsreimau/gktw");
const { createServer } = require("node:http");
const { resolve } = require("node:path");
const { styleText } = require("node:util");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const { say } = require("cfonts");
const pkg = require("./package.json");

axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => {
        const status = error.response?.status;
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || status === 408 || status === 429;
    },
    retryDelay: (retryCount) => Math.pow(2, retryCount - 1) * 1000 + Math.random() * 500
});

Object.assign(global, {
    axios,
    config: new Config(resolve(__dirname, "config.json")),
    formatter: Formatter,
    tools: require("./tools/exports.js")
});

console.log(styleText("cyan", "Starting..."));

say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});
say(`${pkg.description} - By ${pkg.author}`, {
    font: "console",
    colors: ["#E0F7FF"],
    align: "center"
});

if (config.system && config.system.useServer) {
    const port = config.system.port;
    createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => console.log(styleText("green", `${pkg.name} runs on port ${port}`)));
}

require("./main.js");