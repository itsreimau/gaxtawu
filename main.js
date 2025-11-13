// Impor modul dan dependensi yang diperlukan
const middleware = require("./middleware.js");
const events = require("./events/handler.js");
const { Client, CommandHandler } = require("@itsreimau/gktw");
const path = require("node:path");
const util = require("node:util");

// Konfigurasi bot
const {
    bot: botConfig,
    system
} = config;
const diretory = {
    auth: path.resolve(__dirname, "state"),
    database: path.resolve(__dirname, "database"),
    command: path.resolve(__dirname, "commands")
};

consolefy.log("Connecting..."); // Logging proses koneksi

// Buat instance bot
const bot = new Client({
    authDir: diretory.auth,
    WAVersion: system.WAVersion,
    printQRInTerminal: !system.usePairingCode,
    phoneNumber: botConfig.phoneNumber,
    usePairingCode: system.usePairingCode,
    customPairingCode: system.customPairingCode,
    useStore: system.useStore,
    readIncomingMsg: system.autoRead,
    markOnlineOnConnect: system.alwaysOnline,
    prefix: botConfig.prefix,
    selfReply: system.selfReply,
    autoAiLabel: system.autoAiLabel,
    databaseDir: diretory.database,
    citation: {
        owner: [system.selfOwner ? "bot" : null, config.owner.id, ...config.owner.co.map(co => co.id)].filter(Boolean)
    }
});

// Inisialisasi event dan middleware
events(bot);
middleware(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, diretory.command);
cmd.load();

bot.launch().catch(error => consolefy.error(`Error: ${util.format(error)}`)); // Luncurkan bot