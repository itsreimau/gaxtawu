const { client, commandHandler } = require("#engine");
const { resolve } = require("node:path");
const util = require("node:util");
const events = require("./events");
const middlewares = require("./middlewares");

const {
    bot: botConfig,
    system
} = config;
const directory = {
    auth: resolve(__dirname, "state"),
    database: resolve(__dirname, "database"),
    command: resolve(__dirname, "commands")
};

console.log("[*] Connecting...");

const parsePrefix = function(prefix) {
    if (typeof prefix !== "string") return prefix;
    const match = prefix.match(/(\/?)(.+)\1([a-z]*)/i);
    if (!match) return prefix;
    const validFlags = Array.from(new Set(match[3])).filter(flag => "gimsuy".includes(flag)).join("");
    try {
        return new RegExp(match[2], validFlags);
    } catch {
        return prefix;
    }
};

const bot = new client({
    auth: {
        dir: directory.auth,
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
        dir: directory.database,
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

events(bot);
middlewares(bot);

const cmd = new commandHandler(bot, directory.command);
cmd.load();

bot.launch().catch(error => console.error(util.styleText("red", "[x]"), `Error: ${util.format(error)}`));