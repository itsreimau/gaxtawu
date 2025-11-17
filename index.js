// Impor modul dan dependensi yang diperlukan
const pkg = require("./package.json");
const { Config, Consolefy, Formatter } = require("@itsreimau/gktw");
const CFonts = require("cfonts");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

// Tetapkan variabel global
Object.assign(global, {
    config: new Config(path.resolve(__dirname, "config.json")),
    consolefy: new Consolefy({
        tag: pkg.name
    }),
    formatter: Formatter,
    tools: require("./tools/exports.js")
});

consolefy.log("Starting..."); // Logging proses awal

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
    http.createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => consolefy.success(`${pkg.name} runs on port ${port}`));
}

require("./main.js"); // Jalankan modul utama