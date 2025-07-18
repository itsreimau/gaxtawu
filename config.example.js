// Impor modul dan dependensi yang diperlukan
const {
    Formatter
} = require("@itsreimau/gktw");

// Konfigurasi
global.config = {
    // Informasi bot dasar
    bot: {
        name: "Neu-WaBot", // Nama bot
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Karakter awalan perintah yang diizinkan
        phoneNumber: "6283839203081", // Nomor telepon bot (Tidak perlu diisi jika menggunakan QR code)
        thumbnail: "https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=Neu-WaBot", // Gambar thumbnail bot
        groupJid: "120363403451072024@g.us", // JID untuk group bot (Opsional, jika tidak menggunakan requireBotGroupMembership)
        newsletterJid: "120363370002595070@newsletter", // JID untuk saluran bot

        // Konfigurasi autentikasi sesi bot
        authAdapter: {
            adapter: "default", // Adapter untuk menyimpan sesi (Pilihan adapter: default, mysql, mongo, firebase)

            // Konfigurasi default
            default: {
                authDir: "state"
            },

            // Konfigurasi MySQL
            mysql: {
                host: "localhost:3306", // Nama host
                user: "root", // Nama pengguna
                password: "admin123", // Kata sandi
                database: "Neu-WaBot" // Nama database
            },

            // Konfigurasi MongoDB
            mongodb: {
                url: "mongodb://localhost:27017/Neu-WaBot" // URL
            },

            // Konfigurasi Firebase
            firebase: {
                tableName: "Neu-WaBot", // Nama tabel
                session: "state" // Nama sesi
            }
        }
    },

    // Pesan bot yang disesuaikan untuk situasi tertentu
    msg: {
        admin: Formatter.quote("⛔ Perintah hanya dapat diakses oleh admin grup!"), // Pesan saat perintah hanya untuk admin
        banned: Formatter.quote("⛔ Tidak dapat memproses karena kamu telah dibanned oleh Owner!"), // Pesan untuk pengguna yang dibanned
        botAdmin: Formatter.quote("⛔ Tidak dapat memproses karena bot bukan admin grup ini!"), // Pesan jika bot bukan admin di grup
        botGroupMembership: Formatter.quote(`⛔ Tidak dapat memproses karena kamu tidak bergabung dengan grup bot! Ketik ${Formatter.inlineCode("/botgroup")} untuk mendapatkan link grup bot.`), // Pesan jika pengguna tidak bergabung dengan grup bot
        coin: Formatter.quote("⛔ Tidak dapat memproses karena koin-mu tidak cukup!"), // Pesan saat koin tidak cukup
        cooldown: Formatter.quote("🔄 Perintah ini sedang dalam cooldown, tunggu..."), // Pesan saat cooldown perintah
        gamerestrict: Formatter.quote("⛔ Tidak dapat memproses karena grup ini membatasi game!"),
        group: Formatter.quote("⛔ Perintah hanya dapat diakses dalam grup!"), // Pesan untuk perintah grup
        groupSewa: Formatter.quote(`⛔ Bot tidak aktif karena grup ini belum melakukan sewa. Ketik ${Formatter.inlineCode("/price")} untuk melihat harga sewa atau ${Formatter.inlineCode("/owner")} untuk menghubungi Owner bot.`), // Pesan jika grup belum melakukan sewa
        owner: Formatter.quote("⛔ Perintah hanya dapat diakses Owner!"), // Pesan untuk perintah yang hanya owner bisa akses
        premium: Formatter.quote("⛔ Tidak dapat memproses karena kamu bukan pengguna Premium!"), // Pesan jika pengguna bukan Premium
        private: Formatter.quote("⛔ Perintah hanya dapat diakses dalam obrolan pribadi!"), // Pesan untuk perintah obrolan pribadi
        restrict: Formatter.quote("⛔ Perintah ini telah dibatasi karena alasan keamanan!"), // Pesan pembatasan perintah
        unavailableAtNight: Formatter.quote("⛔ Bot tidak tersedia dari jam 12 malam sampai 6 pagi. Silakan kembali nanti!"), // Pesan jika tidak tersedia pada malam hari

        readmore: "\u200E".repeat(4001), // String read more
        note: "“Lorem ipsum dolor sit amet, tenebris in umbra, vitae ad mortem.”", // Catatan
        footer: Formatter.italic("Neu-WaBot By Unity Central"), // Footer di pesan bot

        wait: Formatter.quote("🔄 Tunggu sebentar..."), // Pesan loading
        notFound: Formatter.quote("❎ Tidak ada yang ditemukan! Coba lagi nanti."), // Pesan item tidak ditemukan
        urlInvalid: Formatter.quote("❎ URL tidak valid!") // Pesan jika URL tidak valid
    },

    // Informasi owner bot
    owner: {
        name: "Ariff | Founder [U.C]", // Nama owner bot
        organization: "Unity Central", // Nama organisasi owner bot
        id: "6281313918102", // Nomor telepon owner bot
        co: ["6283879175089"] // Nomor co-owner bot
    },

    // Stiker bot
    sticker: {
        packname: "By", // Nama paket stiker
        author: "Neu-WaBot - s.id/unity_central" // Pembuat stiker
    },

    // Sistem bot
    system: {
        alwaysOnline: true, // Bot selalu berstatus "online"
        antiCall: true, // Bot secara otomatis membanned orang yang menelepon
        autoMention: true, // Bot otomatis mention seseorang dalam pesan yang dikirim
        autoAiLabel: true, // Bot otomatis memamaki label AI dalam pesan yang dikirim (Hanya berfungsi di chat private)
        autoRead: false, // Bot baca pesan otomatis
        autoTypingOnCmd: true, // Tampilkan status "sedang mengetik" saat memproses perintah
        cooldown: 10 * 1000, // Jeda antar perintah (ms)
        maxListeners: 50, // Max listeners untuk events
        port: 3000, // Port (Jika pakai server)
        reportErrorToOwner: true, // Laporkan error ke owner bot
        restrict: false, // Batasi akses perintah
        requireBotGroupMembership: true, // Harus gabung grup bot
        requireGroupSewa: false, // Harus sewa bot untuk bisa dipakai di grup
        selfOwner: false, // Bot jadi owner sendiri
        selfReply: true, // Bot bisa balas pesan bot sendiri
        timeZone: "Asia/Jakarta", // Zona waktu bot
        unavailableAtNight: false, // Bot tidak tersedia pada malam hari, dari jam 12 malam sampai 6 pagi (Waktu akan disesuaikan menurut timeZone)
        uploaderHost: "FastUrl", // Host uploader untuk menyimpan media (Tersedia: Catbox, Cloudku, Erhabot, FastUrl, IDNet, Litterbox, Nyxs, Pomf, Quax, Ryzen, Shojib, TmpErhabot, Uguu, Videy)
        useCoin: true, // Pakai koin
        usePairingCode: true, // Pakai kode pairing untuk koneksi
        customPairingCode: "PAIRCODE", // Kode pairing kustom untuk koneksi (Opsional, jika menggunakan QR code, jika kosong kode pairing akan random)
        useServer: false // Jalankan bot dengan server
    }
};
