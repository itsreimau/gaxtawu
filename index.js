// Impor modul dan dependensi yang diperlukan
require("./config.js");
const tools = require("./tools/exports.js");
const {
    Formatter
} = require("@itsreimau/gktw");
const {
    Consolefy
} = require("@mengkodingan/consolefy");
const CFonts = require("cfonts");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const SimplDB = require("simpl.db");

// Inisialisasi Consolefy untuk logging
const c = new Consolefy({
    tag: pkg.name
});

// Inisialisasi SimplDB untuk Database
const dbFile = path.join(__dirname, "database.json");
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}", "utf8");

// Tetapkan variabel global
Object.assign(global, {
    config,
    consolefy: c,
    db: new SimplDB(),
    formatter: Formatter,
    tools
});

c.log("Starting..."); // Logging proses awal

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
    http.createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => c.success(`${pkg.name} runs on port ${port}`));
}

require("./main.js"); // Jalankan modul utama