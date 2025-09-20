// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const { Baileys, MessageType } = require("@itsreimau/gktw");
const axios = require("axios");
const didYouMean = require("didyoumean");
const util = require("node:util");

const formatBotName = (botName) => {
    if (!botName) return null;
    botName = botName.toLowerCase();
    return botName.replace(/[aiueo0-9\W_]/g, "");
};

function checkMedia(type, required) {
    if (!type || !required) return false;

    const mediaMap = {
        audio: MessageType.audioMessage,
        document: [MessageType.documentMessage, MessageType.documentWithCaptionMessage],
        gif: MessageType.videoMessage,
        groupStatusMention: MessageType.groupStatusMentionMessage,
        image: MessageType.imageMessage,
        sticker: MessageType.stickerMessage,
        text: [MessageType.conversation, MessageType.extendedTextMessage],
        video: MessageType.videoMessage
    };

    const mediaList = Array.isArray(required) ? required : [required];
    for (const media of mediaList) {
        const mappedType = mediaMap[media];
        if (!mappedType) continue;

        if (Array.isArray(mappedType)) {
            if (mappedType.includes(type)) return media;
        } else {
            if (type === mappedType) return media;
        }
    }

    return false;
}

function checkQuotedMedia(type, required) {
    if (!type || !required) return false;

    const mediaMap = {
        audio: MessageType.audioMessage,
        document: [MessageType.documentMessage, MessageType.documentWithCaptionMessage],
        gif: MessageType.videoMessage,
        image: MessageType.imageMessage,
        sticker: MessageType.stickerMessage,
        text: [MessageType.conversation, MessageType.extendedTextMessage],
        video: MessageType.videoMessage
    };

    const mediaList = Array.isArray(required) ? required : [required];
    for (const media of mediaList) {
        const mappedType = mediaMap[media];
        if (!mappedType) continue;

        if (Array.isArray(mappedType)) {
            if (mappedType.includes(type)) return media;
        } else {
            if (type === mappedType) return media;
        }
    }

    return false;
}

function fakeMetaAiQuotedText(text) {
    if (!text) return null;

    const quoted = {
        key: {
            remoteJid: Baileys.STORIES_JID,
            participant: Baileys.META_AI_JID
        },
        message: {
            conversation: text
        }
    };
    return quoted;
}

function generateUID(id, withBotName = true) {
    if (!id) return null;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const charCode = id.charCodeAt(i);
        hash = (hash * 31 + charCode) % 1000000007;
    }

    const uniquePart = id.split("").reverse().join("").charCodeAt(0).toString(16);
    let uid = `${Math.abs(hash).toString(16).toLowerCase()}-${uniquePart}`;
    if (withBotName) uid += `_${formatBotName(config.bot.name)}-wabot`;

    return uid;
}

function getRandomElement(array) {
    if (!array || !array.length) return null;

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function handleError(ctx, error, useAxios = false, reportErrorToOwner = true) {
    const isGroup = ctx.isGroup();
    const groupJid = isGroup ? ctx.id : null;
    const groupSubject = isGroup ? await ctx.group(groupJid).name() : null;
    const errorText = util.format(error);

    consolefy.error(`Error: ${errorText}`);
    if (config.system.reportErrorToOwner && reportErrorToOwner) await ctx.replyWithJid(config.owner.id + Baileys.S_WHATSAPP_NET, {
        text: `${formatter.quote(isGroup ? `⚠️ Terjadi kesalahan dari grup: @${groupJid}, oleh: @${ctx.getId(ctx.sender.jid)}` : `⚠️ Terjadi kesalahan dari: @${ctx.getId(ctx.sender.jid)}`)}\n` +
            `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
            formatter.monospace(errorText),
        mentions: [ctx.sender.jid],
        contextInfo: {
            groupMentions: isGroup ? [{
                groupJid,
                groupSubject
            }] : []
        }
    });
    if (useAxios && error.status !== 200) return await ctx.reply(config.msg.notFound);
    await ctx.reply(formatter.quote(`⚠️ Terjadi kesalahan: ${error.message}`));
}

function isCmd(content, bot) {
    if (!content || !bot) return false;

    const prefix = content.charAt(0);
    if (!new RegExp(bot.prefix, "i").test(content)) return false;

    const [cmdName, ...inputArray] = content.slice(1).trim().toLowerCase().split(/\s+/);
    const input = inputArray.join(" ");

    const cmds = Array.from(bot.cmd.values());
    const matchedCmd = cmds.find(cmd => cmd.name === cmdName || cmd?.aliases?.includes(cmdName));

    if (matchedCmd) return {
        msg: content,
        prefix,
        name: cmdName,
        input
    };

    const mean = didYouMean(cmdName, cmds.flatMap(cmd => [cmd.name, ...(cmd.aliases || [])]));
    return mean ? {
        msg: content,
        prefix,
        didyoumean: mean,
        input
    } : false;
}

function isOwner(id, messageId) {
    if (!id) return false;

    const isSpecialBot = config.system.selfOwner || config.bot.id === config.owner.id || config.bot.lidId === config.owner.lidId || config.owner.co.includes(config.bot.id) || config.owner.coLidId.includes(config.bot.lidId);
    if (isSpecialBot) {
        if (messageId && messageId.startsWith("3EB0")) return false;

        return config.bot.id === id || config.bot.lidId === id || config.owner.id === id || config.owner.lidId === id || config.owner.co.includes(id) || config.owner.coLidId.includes(id);
    }

    return config.owner.id === id || config.owner.lidId === id || config.owner.co.includes(id) || config.owner.coLidId.includes(id);
}

function isUrl(url) {
    if (!url) return false;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(url);
}

function parseFlag(argsString, customRules = {}) {
    if (!argsString) return {
        input: null
    };

    const options = {};
    const input = [];
    const args = argsString.trim().split(/\s+/);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (customRules[arg]) {
            const rule = customRules[arg];

            if (rule.type === "value") {
                const value = args[i + 1];

                if (value && rule.validator(value)) {
                    options[rule.key] = rule.parser(value);
                    i++;
                } else {
                    options[rule.key] = rule.default || null;
                }
            } else if (rule.type === "boolean") {
                options[rule.key] = true;
            }
        } else {
            input.push(arg);
        }
    }

    options.input = input.join(" ");
    return options;
}

async function translate(text, target, source = "auto") {
    if (!text || !target) return null;

    try {
        const apiUrl = api.createUrl("siputzx", "/api/tools/translate", {
            text,
            source,
            target
        });
        const result = (await axios.get(apiUrl)).data.data.translatedText;
        return result;
    } catch (error) {
        consolefy.error(`Error: ${util.format(error)}`);
        return null;
    }
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    fakeMetaAiQuotedText,
    generateUID,
    getRandomElement,
    handleError,
    isCmd,
    isOwner,
    isUrl,
    parseFlag,
    translate
};