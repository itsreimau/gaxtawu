const moment = require("moment-timezone");

function convertMsToDuration(ms) {
    if (!ms || ms <= 0) return "0 detik";

    const duration = moment.duration(ms);
    const hasLargerUnits = duration.asSeconds() >= 1;

    const parts = [];

    if (duration.years() > 0) parts.push(`${duration.years()} tahun`);
    if (duration.months() > 0) parts.push(`${duration.months()} bulan`);
    if (duration.weeks() > 0) parts.push(`${duration.weeks()} minggu`);
    if (duration.days() > 0) parts.push(`${duration.days()} hari`);
    if (duration.hours() > 0) parts.push(`${duration.hours()} jam`);
    if (duration.minutes() > 0) parts.push(`${duration.minutes()} menit`);
    if (duration.seconds() > 0) parts.push(`${duration.seconds()} detik`);

    if (!hasLargerUnits && duration.milliseconds() > 0) parts.push(`${duration.milliseconds()} milidetik`);

    return parts.join(" ") || "0 detik";
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