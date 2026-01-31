const moment = require("moment-timezone");

function convertMsToDuration(ms, requestedParts = null) {
    if (!ms || ms <= 0) return "0 detik";

    const duration = moment.duration(ms);
    const hasLargerUnits = duration.asSeconds() >= 1;

    const units = {
        tahun: {
            value: duration.years(),
            condition: duration.years() > 0
        },
        bulan: {
            value: duration.months(),
            condition: duration.months() > 0
        },
        minggu: {
            value: duration.weeks(),
            condition: duration.weeks() > 0
        },
        hari: {
            value: duration.days(),
            condition: duration.days() > 0
        },
        jam: {
            value: duration.hours(),
            condition: duration.hours() > 0
        },
        menit: {
            value: duration.minutes(),
            condition: duration.minutes() > 0
        },
        detik: {
            value: duration.seconds(),
            condition: duration.seconds() > 0
        },
        milidetik: {
            value: duration.milliseconds(),
            condition: duration.milliseconds() > 0
        }
    };

    const parts = [];

    if (requestedParts && Array.isArray(requestedParts)) {
        for (const part of requestedParts) {
            if (units[part]) parts.push(`${units[part].value} ${part}`);
        }
    } else {
        for (const [unit, data] of Object.entries(units)) {
            if (unit === "milidetik") {
                if (!hasLargerUnits && data.value > 0) parts.push(`${data.value} ${unit}`);
            } else if (data.condition) {
                parts.push(`${data.value} ${unit}`);
            }
        }
    }

    return parts.length > 0 ? parts.join(" ") : "0 detik";
}

function formatSize(byteCount, withPerSecond = false) {
    if (!byteCount) return `0 yBytes${withPerSecond ? "/s" : ""}`;

    let index = 8;
    let size = byteCount;
    const bytes = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }

    while (size >= 1024 && index < bytes.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${bytes[index]}${withPerSecond ? "/s" : ""}`;
}

function generateCmdExample(used, args) {
    if (!used || !args) return `${formatter.inlineCode("used")} atau ${formatter.inlineCode("args")} harus diberikan!`;
    return `Contoh: ${formatter.inlineCode(`${used.prefix + used.command} ${args}`)}`;
}

function generateInstruction(actions, mediaTypes) {
    if (!actions || !actions.length) return `${formatter.inlineCode("actions")} yang diperlukan harus ditentukan!`;

    let translatedMediaTypes;
    if (typeof mediaTypes === "string") {
        translatedMediaTypes = [mediaTypes];
    } else if (Array.isArray(mediaTypes)) {
        translatedMediaTypes = mediaTypes;
    } else {
        return `${formatter.inlineCode("mediaTypes")} harus berupa string atau array string!`;
    }

    const mediaTypeTranslations = {
        audio: "audio",
        document: "dokumen",
        gif: "GIF",
        image: "gambar",
        sticker: "stiker",
        text: "teks",
        video: "video",
        viewOnce: "sekali lihat"
    };

    const translatedMediaTypeList = translatedMediaTypes.map(type => mediaTypeTranslations[type]);

    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = `${translatedMediaTypeList.slice(0, -1).join(", ")}, atau ${lastMediaType}`;
    } else {
        mediaTypesList = translatedMediaTypeList[0];
    }

    const actionTranslations = {
        send: "Kirim",
        reply: "Balas"
    };

    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " atau " : "");
    return `ⓘ ${formatter.italic(`${actionList} ${mediaTypesList}!`)}`;
}

function generatesFlagInfo(flags) {
    if (!flags || typeof flags !== "object") return `${formatter.inlineCode("flags")} harus berupa objek!`;
    return "Flag:\n" +
        Object.entries(flags).map(([flag, description]) => `- ${formatter.inlineCode(flag)}: ${description}`).join("\n");
}

function generateNotes(notes) {
    if (!notes || !Array.isArray(notes)) return `${formatter.inlineCode("notes")} harus berupa string!`;
    return "Catatan:\n" +
        notes.map(note => `- ${note}`).join("\n");
}

function ucwords(text) {
    if (!text) return null;
    return text.toLowerCase().replace(/\b\w/g, txt => txt.toUpperCase());
}

module.exports = {
    convertMsToDuration,
    formatSize,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    ucwords
};