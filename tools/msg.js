const bytes = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

function convertMsToDuration(ms, units = []) {
    if (!ms || ms <= 0) return "0 hari";

    const timeUnits = {
        tahun: 31557600000,
        bulan: 2629800000,
        minggu: 604800000,
        hari: 86400000,
        jam: 3600000,
        menit: 60000,
        detik: 1000,
        milidetik: 1
    };

    if (units.length > 0) {
        let result = [];
        for (const unit of units) {
            if (timeUnits[unit]) {
                const value = Math.floor(ms / timeUnits[unit]);
                if (value > 0) result.push(`${value} ${unit}`);
                ms %= timeUnits[unit];
            }
        }
        return result.join(" ") || "0 " + units[0];
    }

    let result = [];
    for (const [unit, duration] of Object.entries(timeUnits)) {
        const value = Math.floor(ms / duration);
        if (value > 0) {
            result.push(`${value} ${unit}`);
            ms %= duration;
        }
    }
    return result.join(" ") || "0 detik";
}

function formatSize(byteCount) {
    if (!byteCount) return "0 yBytes";

    let index = 8;
    let size = byteCount;

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }

    while (size >= 1024 && index < bytes.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${bytes[index]}`;
}

function formatSizePerSecond(byteCount) {
    if (!byteCount) return "0 yBytes/s";

    let index = 8;
    let size = byteCount;

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }

    while (size >= 1024 && index < bytes.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${bytes[index]}/s`;
}

function generateCmdExample(used, args) {
    if (!used) return `${formatter.inlineCode("used")} harus diberikan!`;
    if (!args) return `${formatter.inlineCode("args")} harus diberikan!`;

    const cmdMsg = `Contoh: ${formatter.inlineCode(`${used.prefix + used.command} ${args}`)}`;
    return cmdMsg;
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
        "audio": "audio",
        "document": "dokumen",
        "gif": "GIF",
        "image": "gambar",
        "sticker": "stiker",
        "text": "teks",
        "video": "video",
        "viewOnce": "sekali lihat"
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
        "send": "Kirim",
        "reply": "Balas"
    };

    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " atau " : "");
    return `📌 ${actionList} ${mediaTypesList}!`;
}

function generatesFlagInfo(flags) {
    if (typeof flags !== "object" || !flags) return `${formatter.inlineCode("flags")} harus berupa objek!`;

    const flagInfo = "Flag:\n" +
        Object.entries(flags).map(([flag, description]) => formatter.quote(`• ${formatter.inlineCode(flag)}: ${description}`)).join("\n");
    return flagInfo;
}

function generateNotes(notes) {
    if (!Array.isArray(notes)) return `${formatter.inlineCode("notes")} harus berupa string!`;

    const notesMsg = "Catatan:\n" +
        notes.map(note => formatter.quote(`• ${note}`)).join("\n");
    return notesMsg;
}

function ucwords(text) {
    if (!text) return null;

    return text.toLowerCase().replace(/\b\w/g, (t) => t.toUpperCase());
}

module.exports = {
    convertMsToDuration,
    formatSize,
    formatSizePerSecond,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    ucwords
};