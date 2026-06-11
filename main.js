// Impor modul dan dependensi yang diperlukan
const { Client, CommandHandler } = require("@itsreimau/gktw");
const { resolve } = require("node:path");
const util = require("node:util");
const events = require("./events/exports.js");
const middleware = require("./middleware.js");

// Konfigurasi bot
const {
    bot: botConfig,
    system
} = config;
const diretory = {
    auth: resolve(__dirname, "state"),
    database: resolve(__dirname, "database"),
    command: resolve(__dirname, "commands")
};

console.log(util.styleText("cyan", "Connecting..."));

// Fungsi untuk mengurai prefix
const parsePrefix = function(prefix) {
    if (typeof prefix !== "string") return prefix;
    var match = prefix.match(/(\/?)(.+)\1([a-z]*)/i);
    if (!match) return prefix;
    var validFlags = Array.from(new Set(match[3])).filter(function(flag) {
        return "gimsuy".includes(flag);
    }).join("");
    try {
        return new RegExp(match[2], validFlags);
    } catch (error) {
        return prefix;
    }
};

// Buat instance bot
const bot = new Client({
    auth: {
        dir: diretory.auth,
        phoneNumber: botConfig.phoneNumber,
        usePairingCode: system.usePairingCode,
        customPairingCode: system.customPairingCode,
        useStore: system.useStore
    },
    connection: {
        version: system?.WAVersion,
        alwaysOnline: system.alwaysOnline,
        selfReply: system.selfReply,
        loggerLevel: system?.loggerLevel
    },
    messaging: {
        autoRead: system.autoRead,
        prefix: parsePrefix(botConfig?.prefix)
    },
    database: {
        dir: diretory.database
    },
    owner: [config.owner.id, ...config.owner.co.map(co => co.id)].filter(Boolean)
});

// Inisialisasi event dan middleware
events(bot);
middleware(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, diretory.command);
cmd.load();

bot.launch().catch(error => console.error(`Error: ${util.format(error)}`)); // Luncurkan bot