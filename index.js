// Impor modul dan dependensi yang diperlukan
require("node:process").loadEnvFile();
const { Config, Formatter } = require("@itsreimau/gktw");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const path = require("node:path");
const pkg = require("./package.json");
const CFonts = require("cfonts");
const http = require("node:http");

/// Tetapkan axios retry
axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => {
        const status = error.response?.status;
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || status === 408 || status === 429;
    },
    retryDelay: (retryCount) => Math.pow(2, retryCount - 1) * 1000 + Math.random() * 500
});

// Tetapkan variabel global
Object.assign(global, {
    axios,
    config: new Config(path.resolve(__dirname, "config.json")),
    formatter: Formatter,
    tools: require("./tools/exports.js")
});

console.log("Starting..."); // Logging proses awal

// Tampilkan nama proyek serta deskripsi lain
CFonts.say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});
CFonts.say(`${pkg.description} - By ${pkg.author}`, {
    font: "console",
    colors: ["#E0F7FF"],
    align: "center"
});

// Jalankan server jika diaktifkan dalam konfigurasi
if (config.system && config.system.useServer) {
    const port = config.system.port;
    http.createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => console.log(`${pkg.name} runs on port ${port}`));
}

require("./main.js"); // Jalankan modul utama