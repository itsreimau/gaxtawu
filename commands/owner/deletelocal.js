// CARA PAKAI (hanya owner):
//   /deletelocal             → lihat daftar file (sama seperti /getlocal)
//   /deletelocal image1      → hapus gambar ke-1
//   /deletelocal video2      → hapus video ke-2
//   /deletelocal doc1        → hapus dokumen ke-1
//   /deletelocal all         → hapus SEMUA file (minta konfirmasi)
//   /deletelocal all confirm → hapus SEMUA file (konfirmasi)

const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const EXT_CATEGORY = {
    ".jpg": "image", ".jpeg": "image", ".png": "image", ".webp": "image", ".gif": "image",
    ".mp4": "video", ".mkv": "video", ".webm": "video", ".avi": "video",
    ".mp3": "audio", ".ogg": "audio", ".wav": "audio", ".aac": "audio", ".m4a": "audio",
    ".pdf": "doc", ".doc": "doc", ".docx": "doc", ".xls": "doc", ".xlsx": "doc",
    ".txt": "doc", ".zip": "doc", ".rar": "doc",
};

const CATEGORY_EMOJI = {
    image: "🖼️", video: "🎬", audio: "🎵", doc: "📄", sticker: "🎭", other: "🗂️"
};

function getCategory(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (ext === ".webp" && fileName.startsWith("sticker_")) return "sticker";
    return EXT_CATEGORY[ext] || "other";
}

function getGroupedFiles() {
    let files;
    try { files = fs.readdirSync(UPLOAD_DIR); } catch { return {}; }

    const grouped = { image: [], video: [], audio: [], doc: [], sticker: [], other: [] };
    files
        .map(f => {
            const stat = fs.statSync(path.join(UPLOAD_DIR, f));
            return { name: f, size: stat.size, mtime: stat.mtime };
        })
        .sort((a, b) => a.mtime - b.mtime)
        .forEach(f => {
            const cat = getCategory(f.name);
            grouped[cat].push(f);
        });
    return grouped;
}

module.exports = {
    name: "deletelocal",
    aliases: ["dl", "dellocal", "rmlocal"],
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
        const input = args.join(" ").trim().toLowerCase();

        // Tidak ada argumen → tampilkan daftar
        if (!input || input === "list") {
            return await listFiles(ctx);
        }

        // Hapus semua file
        if (input === "all") {
            const grouped = getGroupedFiles();
            const total = Object.values(grouped).reduce((a, b) => a + b.length, 0);

            if (total === 0) {
                return await ctx.reply("📂 Folder uploads sudah kosong.");
            }

            return await ctx.reply(
                `⚠️ *PERINGATAN!*\n\n` +
                `Kamu akan menghapus *${total} file* secara permanen!\n\n` +
                `Ketik */deletelocal all confirm* untuk konfirmasi.`
            );
        }

        // Konfirmasi hapus semua
        if (input === "all confirm") {
            return await deleteAll(ctx);
        }

        // Hapus per tipe dan nomor: image1, video2, dst
        const match = input.match(/^([a-zA-Z]+?)(\d+)$/);
        if (!match) {
            return await ctx.reply(
                "❌ Format salah!\n\n" +
                "Contoh:\n" +
                "`/deletelocal image1` → hapus gambar ke-1\n" +
                "`/deletelocal video2` → hapus video ke-2\n" +
                "`/deletelocal all` → hapus semua file\n\n" +
                "Ketik */deletelocal* untuk melihat daftar file."
            );
        }

        const [, typeInput, numStr] = match;
        const num = parseInt(numStr);

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
                `Tipe yang tersedia: *image, video, audio, doc, sticker, other*`
            );
        }

        const list = grouped[category];

        if (list.length === 0) {
            return await ctx.reply(`❌ Tidak ada file dengan tipe *${category}*.`);
        }

        if (num < 1 || num > list.length) {
            return await ctx.reply(
                `❌ Nomor *${num}* tidak valid!\n\n` +
                `File *${category}* tersedia: nomor *1* sampai *${list.length}*`
            );
        }

        const targetFile = list[num - 1];
        await deleteFile(ctx, targetFile);
    }
};

// ─────────────────────────────────────────
// Tampilkan daftar file
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

    let message = `🗑️ *Hapus File Lokal*\n`;
    message += `📊 Total: *${totalFiles} file*\n`;
    message += `──────────────────\n\n`;

    for (const [cat, files] of Object.entries(grouped)) {
        if (files.length === 0) continue;
        const emoji = CATEGORY_EMOJI[cat];
        message += `${emoji} *${cat.toUpperCase()}* (${files.length} file)\n`;
        files.slice(0, 10).forEach((f, i) => {
            const sizeStr = f.size >= 1024 * 1024
                ? (f.size / (1024 * 1024)).toFixed(1) + " MB"
                : (f.size / 1024).toFixed(0) + " KB";
            message += `  *${cat}${i + 1}* → ${f.name.substring(0, 28)}${f.name.length > 28 ? "..." : ""} _(${sizeStr})_\n`;
        });
        if (files.length > 10) message += `  _...dan ${files.length - 10} file lainnya_\n`;
        message += "\n";
    }

    message += `──────────────────\n`;
    message += `*Cara hapus file:*\n`;
    message += `\`/deletelocal [tipe][nomor]\`\n`;
    message += `\`/deletelocal all\` → hapus semua\n\n`;
    message += `*Contoh:*\n\`/deletelocal image1\``;

    await ctx.reply(message);
}

// ─────────────────────────────────────────
// Hapus satu file
// ─────────────────────────────────────────
async function deleteFile(ctx, fileInfo) {
    const filePath = path.join(UPLOAD_DIR, fileInfo.name);

    try {
        fs.unlinkSync(filePath);

        const sizeStr = fileInfo.size >= 1024 * 1024
            ? (fileInfo.size / (1024 * 1024)).toFixed(2) + " MB"
            : (fileInfo.size / 1024).toFixed(2) + " KB";

        await ctx.reply(
            `✅ *File berhasil dihapus!*\n\n` +
            `🗑️ *Nama:* ${fileInfo.name}\n` +
            `📦 *Ukuran:* ${sizeStr}\n` +
            `🕐 *Waktu:* ${new Date().toLocaleString("id-ID")}`
        );
    } catch (err) {
        console.error("[deletelocal] Error:", err);
        await ctx.reply(`❌ Gagal menghapus file!\n\nError: ${err.message}`);
    }
}

// ─────────────────────────────────────────
// Hapus semua file
// ─────────────────────────────────────────
async function deleteAll(ctx) {
    const grouped = getGroupedFiles();
    const allFiles = Object.values(grouped).flat();

    if (allFiles.length === 0) {
        return await ctx.reply("📂 Folder uploads sudah kosong.");
    }

    await ctx.reply(`⏳ Menghapus *${allFiles.length} file*...`);

    let deleted = 0;
    let failed = 0;
    let totalSize = 0;

    for (const f of allFiles) {
        try {
            const filePath = path.join(UPLOAD_DIR, f.name);
            fs.unlinkSync(filePath);
            deleted++;
            totalSize += f.size;
        } catch {
            failed++;
        }
    }

    const sizeStr = totalSize >= 1024 * 1024
        ? (totalSize / (1024 * 1024)).toFixed(2) + " MB"
        : (totalSize / 1024).toFixed(2) + " KB";

    await ctx.reply(
        `✅ *Selesai menghapus semua file!*\n\n` +
        `🗑️ *Berhasil dihapus:* ${deleted} file\n` +
        (failed > 0 ? `❌ *Gagal:* ${failed} file\n` : "") +
        `💾 *Ruang terbebas:* ${sizeStr}\n` +
        `🕐 *Waktu:* ${new Date().toLocaleString("id-ID")}`
    );
}
