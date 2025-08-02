// Impor modul dan dependensi yang diperlukan
const middleware = require("./middleware.js");
const events = require("./events/handler.js");
const {
    Client,
    CommandHandler
} = require("@itsreimau/gktw");
const path = require("node:path");
const util = require("node:util");

// Konfigurasi bot dari file 'config.js'
const {
    bot: botConfig,
    system
} = config;
const {
    authAdapter
} = botConfig;

// Pilih adapter autentikasi
const adapters = {
    mysql: () => require("baileys-mysql").useSqlAuthState(authAdapter.mysql),
    mongodb: () => require("baileys-mongodb").useMongoAuthState(authAdapter.mongodb.url),
    firebase: () => require("baileys-firebase").useFireAuthState(authAdapter.firebase)
};
const selectedAuthAdapter = adapters[authAdapter.adapter] ? adapters[authAdapter.adapter]() : null;

consolefy.log("Connecting..."); // Logging proses koneksi

// Buat instance bot
const bot = new Client({
    prefix: botConfig.prefix,
    phoneNumber: botConfig.phoneNumber,
    authAdapter: selectedAuthAdapter,
    authDir: authAdapter.adapter === "default" ? path.resolve(__dirname, authAdapter.default.authDir) : null,
    readIncommingMsg: system.autoRead,
    printQRInTerminal: !system.usePairingCode,
    markOnlineOnConnect: system.alwaysOnline,
    usePairingCode: system.usePairingCode,
    customPairingCode: system.customPairingCode,
    selfReply: system.selfReply,
    autoMention: system.autoMention,
    WAVersion: [2, 3000, 1025091846]
});

// Inisialisasi event dan middleware
events(bot);
middleware(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

bot.launch().catch(error => consolefy.error(`Error: ${util.format(error)}`)); // Luncurkan bot