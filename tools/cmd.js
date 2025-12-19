// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const { Baileys, MessageType, Gktw } = require("@itsreimau/gktw");
const axios = require("axios");
const util = require("node:util");

const formatBotName = botName => {
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

function delay(ms) {
    if (!ms) return null;
    return new Promise(res => setTimeout(res, ms));
}

function fakeQuotedText(text) {
    if (!text) return null;
    return {
        key: {
            remoteJid: Baileys.PSA_WID
        },
        message: {
            conversation: text
        }
    };
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
    if (!array || !array.length || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

function getReportOwner() {
    const owners = [];
    if (config.owner.report) owners.push(config.owner.id);
    if (config.owner.co && Array.isArray(config.owner.co)) {
        config.owner.co.forEach(co => {
            if (co.report === true) owners.push(co.id);
        });
    }
    return owners.length > 0 ? owners : false;
}

async function handleError(ctx, error, useAxios = false, reportToOwner = true) {
    const isGroup = ctx.isGroup();
    const groupJid = isGroup ? ctx.id : null;
    const groupSubject = isGroup ? await ctx.group(groupJid).name() : null;
    const errorText = util.format(error);
    const reportOwner = getReportOwner();

    consolefy.error(`Error: ${errorText}`);
    if (reportToOwner && reportOwner && reportOwner.length > 0) {
        for (const ownerId of reportOwner) {
            await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                text: `ⓘ ${formatter.italic(isGroup ? `Terjadi kesalahan dari grup: @${groupJid}, oleh: @${ctx.getId(ctx.sender.jid)}` : `Terjadi kesalahan dari: @${ctx.getId(ctx.sender.jid)}`)}\n` +
                    formatter.monospace(errorText),
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    groupMentions: isGroup ? [{
                        groupJid,
                        groupSubject
                    }] : []
                }
            });
            await delay(500);
        }
    }
    if (useAxios && error.status !== 200) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.notFound)}`);
    await ctx.reply(`ⓘ ${formatter.italic(`Terjadi kesalahan: ${error.message}`)}`);
}

function isCmd(text, ctxBot) {
    if (!text || !ctxBot) return false;

    const prefix = text.charAt(0);
    if (!new RegExp(ctxBot.prefix, "i").test(text)) return false;

    const [cmdName, ...inputArray] = text.slice(1).toLowerCase().split(/\s+/);
    const input = inputArray.join(" ");

    const cmds = Array.from(ctxBot.cmd.values());
    const matchedCmd = cmds.find(cmd => cmd.name === cmdName || cmd?.aliases?.includes(cmdName));

    if (matchedCmd)
        return {
            msg: text,
            prefix,
            name: cmdName,
            input
        };

    const mean = Gktw.didYouMean(cmdName, cmds.flatMap(cmd => [cmd.name, ...(cmd.aliases || [])]));
    return mean ? {
        msg: text,
        prefix,
        didyoumean: mean,
        input
    } : false;
}

function isUrl(url) {
    if (!url) return false;
    return /(https?:\/\/[^\s]+)/g.test(url);
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    delay,
    fakeQuotedText,
    generateUID,
    getRandomElement,
    getReportOwner,
    handleError,
    isCmd,
    isUrl
};