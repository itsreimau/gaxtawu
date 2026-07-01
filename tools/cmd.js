// Impor modul dan dependensi yang diperlukan
const { Baileys, Gktw, MessageType } = require("@itsreimau/gktw");
const { format } = require("node:util");

function calculateDelay(totalTargets) {
    if (!totalTargets || totalTargets <= 0) return null;

    const getBaseDelay = (total) => {
        if (total <= 5) return 5000;
        if (total <= 15) return 10000;
        if (total <= 30) return 20000;
        return 30000;
    };
    const delays = Array.from({
        length: totalTargets
    }, () => {
        const baseDelay = getBaseDelay(totalTargets);
        const randomRange = baseDelay;
        let delay = baseDelay + Math.random() * randomRange;
        delay *= 0.8 + Math.random() * 0.8;
        return Math.floor(delay);
    });
    const totalDuration = delays.reduce((sum, d) => sum + d, 0);
    return {
        delay: delays,
        duration: totalDuration
    };
}

function calculateDimensions(width, height) {
    const maxSize = 640;
    if (width <= maxSize && height <= maxSize)
        return {
            width,
            height
        };

    const ratio = Math.min(maxSize / width, maxSize / height);
    return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio)
    };
}

function checkMedia(type, required) {
    if (!type || !required || !Array.isArray(required)) return false;

    const mediaMap = {
        audio: MessageType.audioMessage,
        document: [MessageType.documentMessage, MessageType.documentWithCaptionMessage],
        image: MessageType.imageMessage,
        sticker: MessageType.stickerMessage,
        text: [MessageType.conversation, MessageType.extendedTextMessage],
        video: MessageType.videoMessage
    };
    for (const media of required) {
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
    if (!type || !required || !Array.isArray(required)) return false;

    const mediaMap = {
        audio: MessageType.audioMessage,
        document: [MessageType.documentMessage, MessageType.documentWithCaptionMessage],
        image: MessageType.imageMessage,
        sticker: MessageType.stickerMessage,
        text: [MessageType.conversation, MessageType.extendedTextMessage],
        video: MessageType.videoMessage
    };
    for (const media of required) {
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

function extractUrlFromText(text) {
    if (!text) return null;
    return Baileys.extractUrlFromText(text) || null;
}

async function getJpegThumbnail(url) {
    const stream = await Baileys.getHttpStream(url);
    const result = await Baileys.extractImageThumb(stream, 300);
    return result.buffer;
}

function getRandomElement(array) {
    if (!array || !Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

function getReportOwner() {
    const owners = [];
    if (config.owner.report) owners.push(config.owner.id);
    if (config.owner.co && Array.isArray(config.owner.co))
        config.owner.co.forEach(co => {
            if (co.report) owners.push(co.id);
        });
    return owners.length > 0 ? owners : false;
}

async function handleError(ctx, error, useAxios = false, silent = false) {
    if (!silent) {
        const isGroup = ctx.isGroup();
        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupSubject = isGroup ? await ctx.group(groupJid).name() : null;
        const errorText = format(error);
        const reportOwner = getReportOwner();

        console.error(`Error: ${errorText}`);
        if (reportOwner && reportOwner.length > 0) {
            const {
                delay
            } = calculateDelay(reportOwner.length);
            for (const ownerId of reportOwner) {
                await ctx.replyWithJid(ownerId + Baileys.S_WHATSAPP_NET, {
                    text: `${isGroup ? `Terjadi kesalahan dari grup: @${groupJid}, oleh: @${senderId}` : `Terjadi kesalahan dari: @${senderId}`}\n` +
                        formatter.monospace(errorText),
                    contextInfo: {
                        mentionedJid: [senderJid],
                        groupMentions: isGroup ? [{
                            groupJid,
                            groupSubject
                        }] : []
                    }
                });
                await Baileys.delay(delay);
            }
        }
        if (useAxios && error.status !== 200) return await ctx.reply(tools.msg.info(config.msg.notFound));
    }
    await ctx.reply(tools.msg.info(config.msg.error));
}

function isUrl(url) {
    if (!url) return false;
    return /(https?:\/\/[^\s]+)/g.test(url);
}

module.exports = {
    areJidsSameUser: Baileys.areJidsSameUser,
    calculateDelay,
    calculateDimensions,
    checkMedia,
    checkQuotedMedia,
    extractUrlFromText,
    delay: Baileys.delay,
    didYouMean: Gktw.didYouMean,
    getJpegThumbnail,
    getRandomElement,
    getReportOwner,
    handleError,
    isUrl
};