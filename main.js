// Impor modul dan dependensi yang diperlukan
const { Client, CommandHandler } = require("@itsreimau/gktw");
const path = require("node:path");
const events = require("./events/handler.js");
const middleware = require("./middleware.js");
const util = require("node:util");

// Konfigurasi bot
const { bot: botConfig, system } = config;
const diretory = {
	auth: path.resolve(__dirname, "state"),
	database: path.resolve(__dirname, "database"),
	command: path.resolve(__dirname, "commands"),
};

consolefy.log("Connecting..."); // Logging proses koneksi

// Fungsi untuk mengurai prefix
const parsePrefix = function (prefix) {
	if (typeof prefix !== "string") return prefix;
	var match = prefix.match(/(\/?)(.+)\1([a-z]*)/i);
	if (!match) return prefix;
	var validFlags = Array.from(new Set(match[3]))
		.filter(function (flag) {
			return "gimsuy".includes(flag);
		})
		.join("");
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
		useStore: system.useStore,
	},
	connection: {
		version: system?.WAVersion,
		alwaysOnline: system.alwaysOnline,
		selfReply: system.selfReply,
	},
	messaging: {
		autoRead: system.autoRead,
		prefix: parsePrefix(botConfig?.prefix),
	},
	database: {
		dir: diretory.database,
	},
	owner: [config.owner.id, ...config.owner.co.map((co) => co.id)].filter(
		Boolean
	),
});

// Inisialisasi event dan middleware
events(bot);
middleware(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, diretory.command);
cmd.load();

bot.launch().catch((error) => consolefy.error(`Error: ${util.format(error)}`)); // Luncurkan bot
