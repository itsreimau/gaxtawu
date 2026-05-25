// CARA PAKAI (hanya owner):
//   /getlocal              → lihat daftar semua file (dikelompokkan + nomor urut)
//   /getlocal image1       → kirim gambar ke-1
//   /getlocal image2       → kirim gambar ke-2
//   /getlocal video1       → kirim video ke-1
//   /getlocal audio1       → kirim audio ke-1
//   /getlocal doc1         → kirim dokumen ke-1
//   /getlocal sticker1     → kirim stiker ke-1
//   /getlocal other1       → kirim file lainnya ke-1

const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Mapping ekstensi ke kategori
const EXT_CATEGORY = {
    ".jpg": "image", ".jpeg": "image", ".png": "image", ".webp": "image", ".gif": "image",
    ".mp4": "video", ".mkv": "video", ".webm": "video", ".avi": "video",
    ".mp3": "audio", ".ogg": "audio", ".wav": "audio", ".aac": "audio", ".m4a": "audio",
    ".pdf": "doc", ".doc": "doc", ".docx": "doc", ".xls": "doc", ".xlsx": "doc",
    ".txt": "doc", ".zip": "doc", ".rar": "doc",
    ".sticker": "sticker"
};

const CATEGORY_EMOJI = {
    image: "🖼️",
    video: "🎬",
    audio: "🎵",
    doc: "📄",
    sticker: "🎭",
    other: "🗂️"
};

function getCategory(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    // Cek apakah file sticker (.webp yang namanya diawali "sticker_")
    if (ext === ".webp" && fileName.startsWith("sticker_")) return "sticker";
    return EXT_CATEGORY[ext] || "other";
}

function getGroupedFiles() {
    let files;
    try {
        files = fs.readdirSync(UPLOAD_DIR);
    } catch {
        return {};
    }

    const grouped = { image: [], video: [], audio: [], doc: [], sticker: [], other: [] };

    files
        .map(f => {
            const stat = fs.statSync(path.join(UPLOAD_DIR, f));
            return { name: f, size: stat.size, mtime: stat.mtime };
        })
        .sort((a, b) => a.mtime - b.mtime) // urut dari terlama agar nomor urut konsisten
        .forEach(f => {
            const cat = getCategory(f.name);
            grouped[cat].push(f);
        });

    return grouped;
}

module.exports = {
    name: "getlocal",
    aliases: ["gl", "sendlocal", "ll", "listlocal"],
    category: "owner",
    permissions: {
        admin: false,
        botAdmin: false,
        coin: 0,
        group: false,
        owner: true,
        premium: false,
        private: false,
        restrict: false
    },
    code: async (ctx) => {
        const args = ctx.args || [];
        const input = args.join("").trim().toLowerCase();

        if (!input || input === "list") {
            return await listFiles(ctx);
        }

        // Parse input: pisahkan tipe dan nomor
        // Contoh: "image1" → tipe="image", nomor=1
        const match = input.match(/^([a-zA-Z]+?)(\d+)$/);
        if (!match) {
            return await ctx.reply(
                "❌ Format salah!\n\n" +
                "Gunakan: */getlocal [tipe][nomor]*\n" +
                "Contoh: `/getlocal image1`, `/getlocal video2`, `/getlocal doc1`\n\n" +
                "Ketik */getlocal* untuk melihat daftar file."
            );
        }

        const [, typeInput, numStr] = match;
        const num = parseInt(numStr);

        // Normalisasi alias tipe
        const typeAliasMap = {
            "img": "image", "foto": "image", "photo": "image", "gambar": "image",
            "vid": "video", "mp4": "video",
            "aud": "audio", "mp3": "audio", "musik": "audio", "music": "audio",
            "document": "doc", "file": "doc", "dokumen": "doc",
            "stik": "sticker", "stiker": "sticker",
        };

        const category = typeAliasMap[typeInput] || typeInput;
        const grouped = getGroupedFiles();

        if (!grouped[category]) {
            return await ctx.reply(
                `❌ Tipe *${typeInput}* tidak dikenali!\n\n` +
                `Tipe yang tersedia: *image, video, audio, doc, sticker, other*\n` +
                `Contoh: \`/getlocal image1\``
            );
        }

        const list = grouped[category];

        if (list.length === 0) {
            return await ctx.reply(`❌ Tidak ada file dengan tipe *${category}*.\n\nKetik */getlocal* untuk melihat semua file.`);
        }

        if (num < 1 || num > list.length) {
            return await ctx.reply(
                `❌ Nomor *${num}* tidak valid!\n\n` +
                `File *${category}* tersedia: nomor *1* sampai *${list.length}*\n` +
                `Contoh: \`/getlocal ${category}1\``
            );
        }

        const targetFile = list[num - 1];
        await sendFile(ctx, targetFile.name);
    }
};

// ─────────────────────────────────────────
// Tampilkan daftar file dikelompokkan + nomor urut
// ─────────────────────────────────────────
async function listFiles(ctx) {
    const grouped = getGroupedFiles();

    const totalFiles = Object.values(grouped).reduce((a, b) => a + b.length, 0);
    if (totalFiles === 0) {
        return await ctx.reply(
            "📂 *Folder uploads kosong!*\n\n" +
            "Gunakan */uploadlocal* untuk menyimpan file dari WhatsApp."
        );
    }

    const totalSize = Object.values(grouped).flat()
        .reduce((acc, f) => acc + f.size, 0);
    const totalSizeStr = totalSize >= 1024 * 1024
        ? (totalSize / (1024 * 1024)).toFixed(2) + " MB"
        : (totalSize / 1024).toFixed(1) + " KB";

    let message = `📁 *Daftar File Lokal*\n`;
    message += `📊 Total: *${totalFiles} file* | *${totalSizeStr}*\n`;
    message += `──────────────────\n\n`;

    for (const [cat, files] of Object.entries(grouped)) {
        if (files.length === 0) continue;
        const emoji = CATEGORY_EMOJI[cat];
        message += `${emoji} *${cat.toUpperCase()}* (${files.length} file)\n`;

        files.slice(0, 10).forEach((f, i) => {
            const sizeStr = f.size >= 1024 * 1024
                ? (f.size / (1024 * 1024)).toFixed(1) + " MB"
                : (f.size / 1024).toFixed(0) + " KB";
            const date = f.mtime.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
            message += `  *${cat}${i + 1}* → ${f.name.substring(0, 30)}${f.name.length > 30 ? "..." : ""} _(${sizeStr}, ${date})_\n`;
        });

        if (files.length > 10) {
            message += `  _...dan ${files.length - 10} file lainnya_\n`;
        }
        message += "\n";
    }

    message += `──────────────────\n`;
    message += `*Cara kirim file:*\n`;
    message += `\`/getlocal [tipe][nomor]\`\n\n`;
    message += `*Contoh:*\n`;

    // Contoh dari file yang ada
    const examples = [];
    for (const [cat, files] of Object.entries(grouped)) {
        if (files.length > 0) examples.push(`/getlocal ${cat}1`);
        if (examples.length >= 3) break;
    }
    message += examples.map(e => `\`${e}\``).join("  |  ");

    await ctx.reply(message);
}

// ─────────────────────────────────────────
// Kirim file ke WhatsApp
// ─────────────────────────────────────────
async function sendFile(ctx, fileName) {
    const safeName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeName);

    if (!fs.existsSync(filePath)) {
        return await ctx.reply(`❌ File tidak ditemukan: *${safeName}*`);
    }

    await ctx.reply(`⏳ Mengirim *${safeName}*...`);

    try {
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(safeName).toLowerCase();
        const cat = getCategory(safeName);
        const sizeStr = buffer.length >= 1024 * 1024
            ? (buffer.length / (1024 * 1024)).toFixed(2) + " MB"
            : (buffer.length / 1024).toFixed(2) + " KB";

        if (cat === "image" && ext !== ".webp") {
            await ctx.reply({ image: buffer, caption: `📸 *${safeName}*\n📦 ${sizeStr}` });
        } else if (cat === "sticker" || ext === ".webp") {
            await ctx.reply({ sticker: buffer });
        } else if (cat === "video") {
            await ctx.reply({ video: buffer, caption: `🎬 *${safeName}*\n📦 ${sizeStr}` });
        } else if (cat === "audio") {
            await ctx.reply({ audio: buffer, mimetype: getMimeType(ext), ptt: ext === ".ogg" });
        } else {
            await ctx.reply({ document: buffer, fileName: safeName, mimetype: getMimeType(ext), caption: `📄 *${safeName}*\n📦 ${sizeStr}` });
        }

    } catch (err) {
        console.error("[getlocal] Error:", err);
        await ctx.reply(`❌ Gagal mengirim file!\n\nError: ${err.message}`);
    }
}

function getMimeType(ext) {
    const map = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".webp": "image/webp", ".gif": "image/gif",
        ".mp4": "video/mp4", ".mkv": "video/x-matroska", ".webm": "video/webm",
        ".mp3": "audio/mpeg", ".ogg": "audio/ogg; codecs=opus",
        ".wav": "audio/wav", ".aac": "audio/aac", ".m4a": "audio/mp4",
        ".pdf": "application/pdf", ".zip": "application/zip",
        ".rar": "application/x-rar-compressed",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
    };
    return map[ext] || "application/octet-stream";
}
