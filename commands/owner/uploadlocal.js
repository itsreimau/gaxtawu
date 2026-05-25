// CARA PAKAI (hanya owner):
//   Kirim file/gambar/video/audio sambil ketik /uploadlocal
//   Atau reply ke pesan file dengan /uploadlocal

const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

module.exports = {
    name: "uploadlocal",
    aliases: ["ul", "savelocal"],
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
        const msg = ctx.msg || ctx.message;

        // Tentukan sumber media: pesan saat ini atau quoted
        let mediaSource = null;   // object yang punya .download()
        let mediaType = null;

        const mediaTypes = ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"];

        // Cek apakah pesan saat ini adalah media
        for (const type of mediaTypes) {
            if (msg?.message?.[type]) {
                mediaSource = ctx.msg;
                mediaType = type;
                break;
            }
        }

        // Kalau tidak ada, cek quoted
        if (!mediaSource && ctx.quoted) {
            const quotedMsgContent = ctx.quoted?.message;
            for (const type of mediaTypes) {
                if (quotedMsgContent?.[type]) {
                    mediaSource = ctx.quoted;
                    mediaType = type;
                    break;
                }
            }
        }

        if (!mediaSource || !mediaType) {
            return await ctx.reply(
                "❌ *Tidak ada file yang ditemukan!*\n\n" +
                "Cara pakai:\n" +
                "• Kirim file/gambar/video/audio sambil ketik */uploadlocal*\n" +
                "• Atau reply ke pesan yang berisi file dengan */uploadlocal*"
            );
        }

        await ctx.reply("⏳ Menyimpan file ke komputer...");

        try {
            // Gunakan method .download() dari ctx.quoted atau ctx.msg
            const buffer = await mediaSource.download();

            if (!buffer || buffer.length === 0) {
                return await ctx.reply("❌ File kosong atau gagal didownload.");
            }

            // Tentukan ekstensi file
            const msgContent = mediaSource.message;
            const extMap = {
                imageMessage: getImageExt(msgContent?.imageMessage?.mimetype),
                videoMessage: getVideoExt(msgContent?.videoMessage?.mimetype),
                audioMessage: getAudioExt(msgContent?.audioMessage?.mimetype),
                documentMessage: getDocExt(
                    msgContent?.documentMessage?.fileName,
                    msgContent?.documentMessage?.mimetype
                ),
                stickerMessage: ".webp"
            };
            const ext = extMap[mediaType] || ".bin";

            // Nama file: tipe_sender_timestamp.ext
            const rawSender = typeof ctx.sender === "string"
                ? ctx.sender
                : ctx.sender?.id || ctx.sender?.jid || ctx.sender?.remoteJid ||
                  msg?.key?.participant || msg?.key?.remoteJid || "unknown";
            const sender = rawSender.replace(/[^a-zA-Z0-9]/g, "_");
            const timestamp = Date.now();
            const typeLabel = mediaType.replace("Message", "");
            const fileName = `${typeLabel}_${sender}_${timestamp}${ext}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            fs.writeFileSync(filePath, buffer);

            const fileSizeStr = buffer.length >= 1024 * 1024
                ? (buffer.length / (1024 * 1024)).toFixed(2) + " MB"
                : (buffer.length / 1024).toFixed(2) + " KB";

            await ctx.reply(
                `✅ *File berhasil disimpan!*\n\n` +
                `📁 *Nama file:* ${fileName}\n` +
                `📂 *Lokasi:* uploads/${fileName}\n` +
                `📦 *Ukuran:* ${fileSizeStr}\n` +
                `🕐 *Waktu:* ${new Date().toLocaleString("id-ID")}`
            );

        } catch (err) {
            console.error("[uploadlocal] Error:", err);
            await ctx.reply(`❌ *Gagal menyimpan file!*\n\nError: ${err.message}`);
        }
    }
};

function getImageExt(mime) {
    if (!mime) return ".jpg";
    if (mime.includes("png")) return ".png";
    if (mime.includes("webp")) return ".webp";
    if (mime.includes("gif")) return ".gif";
    return ".jpg";
}

function getVideoExt(mime) {
    if (!mime) return ".mp4";
    if (mime.includes("webm")) return ".webm";
    if (mime.includes("mkv")) return ".mkv";
    return ".mp4";
}

function getAudioExt(mime) {
    if (!mime) return ".mp3";
    if (mime.includes("ogg")) return ".ogg";
    if (mime.includes("wav")) return ".wav";
    if (mime.includes("aac")) return ".aac";
    if (mime.includes("mp4")) return ".m4a";
    return ".mp3";
}

function getDocExt(fileName, mime) {
    if (fileName) {
        const ext = path.extname(fileName);
        if (ext) return ext;
    }
    if (!mime) return ".bin";
    const mimeMap = {
        "application/pdf": ".pdf",
        "application/zip": ".zip",
        "application/x-rar": ".rar",
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "text/plain": ".txt",
    };
    return mimeMap[mime] || ".bin";
}
