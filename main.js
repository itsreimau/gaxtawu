// Impor modul dan dependensi yang diperlukan
const { Client, CommandHandler } = require("@itsreimau/gktw");
const { resolve } = require("node:path");
const util = require("node:util");
const events = require("./events/exports.js");
const middlewares = require("./middlewares/exports.js");

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
        dir: diretory.database,
        defaults: {
            users: {
                pushName: "Unknown",
                coin: 100,
                level: 0,
                xp: 0,
                winGame: 0,
                premium: false,
                premiumExpiration: null,
                banned: false,
                afk: {},
                lastClaim: {},
                sessionId: {},
                lastSentMsg: {},
                botGroupMembership: {},
                autodownload: false
            },
            groups: {
                members: [],
                mute: [],
                warnings: [],
                maxwarnings: 3,
                mutebot: false,
                option: {},
                text: {},
                sewa: false,
                sewaExpiration: null,
                spam: []
            },
            bot: {
                mode: "public",
                restart: {},
                text: {},
                blacklistBroadcast: []
            }
        }
    },
    owner: [config.owner.id, ...config.owner.co.map(co => co.id)].filter(Boolean)
});

// Inisialisasi event dan middleware
events(bot);
middlewares(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, diretory.command);
cmd.load();

bot.launch().catch(error => console.error(`Error: ${util.format(error)}`)); // Luncurkan bot