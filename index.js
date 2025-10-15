// Impor modul dan dependensi yang diperlukan
require("./config.js");
const pkg = require("./package.json");
const { Consolefy } = require("@itsreimau/gktw");
const CFonts = require("cfonts");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

// Inisialisasi Consolefy untuk logging
const _consolefy = new Consolefy({
    tag: pkg.name
});

// Tetapkan variabel global
Object.assign(global, {
    config,
    consolefy: _consolefy,
    formatter: require("@itsreimau/gktw").Formatter,
    tools: require("./tools/exports.js")
});

_consolefy.log("Starting..."); // Logging proses awal

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
if (config.system.useServer) {
    const {
        port
    } = config.system;
    http.createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => _consolefy.success(`${pkg.name} runs on port ${port}`));
}

require("./main.js"); // Jalankan modul utama