// Impor modul dan dependensi yang diperlukan
const {
    inlineCode,
    italic,
    quote
} = require("@im-dims/baileys-library");

// Konfigurasi
global.config = {
    // Informasi bot dasar
    bot: {
        name: "GAXTAWU", // Nama bot
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Karakter awalan untuk memanggil perintah
        phoneNumber: "", // Nomor telepon bot (Tidak perlu diisi jika menggunakan QR code)
        thumbnail: "https://repository-images.githubusercontent.com/753096396/84e76ef0-ba19-4c87-8ec2-ea803b097479", // Gambar thumbnail bot
        groupJid: "", // JID untuk group bot (Tidak perlu diisi jika tidak menggunakan requireBotGroupMembership)
        newsletterJid: "120363416372653441@newsletter", // JID untuk saluran bot

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
                database: "gaxtawu" // Nama database
            },

            // Konfigurasi MongoDB
            mongodb: {
                url: "mongodb://localhost:27017/gaxtawu" // URL
            },

            // Konfigurasi Firebase
            firebase: {
                tableName: "gaxtawu", // Nama tabel
                session: "state" // Nama sesi
            }
        }
    },

    // Pesan bot yang disesuaikan untuk situasi tertentu
    msg: {
        admin: quote("⛔ Perintah hanya dapat diakses oleh admin grup!"), // Pesan saat perintah hanya untuk admin
        banned: quote("⛔ Tidak dapat memproses karena kamu telah dibanned oleh Owner!"), // Pesan untuk pengguna yang dibanned
        botAdmin: quote("⛔ Tidak dapat memproses karena bot bukan admin grup ini!"), // Pesan jika bot bukan admin di grup
        botGroupMembership: quote(`⛔ Tidak dapat memproses karena kamu tidak bergabung dengan grup bot! Ketik ${inlineCode("/botgroup")} untuk mendapatkan link grup bot.`), // Pesan jika pengguna tidak bergabung dengan grup bot
        coin: quote("⛔ Tidak dapat memproses karena koin-mu tidak cukup!"), // Pesan saat koin tidak cukup
        cooldown: quote("🔄 Perintah ini sedang dalam cooldown, tunggu..."), // Pesan saat cooldown perintah
        gamerestrict: quote("⛔ Tidak dapat memproses karena grup ini membatasi game!"), // Pesan jika grup membatasi game
        group: quote("⛔ Perintah hanya dapat diakses dalam grup!"), // Pesan untuk perintah grup
        groupSewa: quote(`⛔ Bot tidak aktif karena grup ini belum melakukan sewa. Ketik ${inlineCode("/price")} untuk melihat harga sewa atau ${inlineCode("/owner")} untuk menghubungi Owner bot.`), // Pesan jika grup belum melakukan sewa
        owner: quote("⛔ Perintah hanya dapat diakses Owner!"), // Pesan untuk perintah yang hanya owner bisa akses
        premium: quote("⛔ Tidak dapat memproses karena kamu bukan pengguna Premium!"), // Pesan jika pengguna bukan Premium
        private: quote("⛔ Perintah hanya dapat diakses dalam obrolan pribadi!"), // Pesan untuk perintah obrolan pribadi
        restrict: quote("⛔ Perintah ini telah dibatasi karena alasan keamanan!"), // Pesan pembatasan perintah
        unavailableAtNight: quote("⛔ Bot tidak tersedia dari jam 12 malam sampai 6 pagi. Silakan kembali nanti!"), // Pesan jika tidak tersedia pada malam hari

        readmore: "\u200E".repeat(4001), // String read more
        note: "“Lorem ipsum dolor sit amet, tenebris in umbra, vitae ad mortem.”", // Catatan
        footer: italic("Developed by ItsReimau with ❤"), // Catatan kaki

        wait: quote("🔄 Tunggu sebentar..."), // Pesan loading
        notFound: quote("❎ Tidak ada yang ditemukan! Coba lagi nanti."), // Pesan item tidak ditemukan
        urlInvalid: quote("❎ URL tidak valid!") // Pesan jika URL tidak valid
    },

    // Informasi owner bot
    owner: {
        name: "", // Nama owner bot
        organization: "", // Nama organisasi owner bot
        id: "", // Nomor telepon owner bot
        co: [""] // Nomor co-owner bot
    },

    // Stiker bot
    sticker: {
        packname: "", // Nama paket stiker
        author: "gaxtawu <github.com/itsreimau/gaxtawu>" // Pembuat stiker
    },

    // Sistem bot
    system: {
        alwaysOnline: true, // Bot selalu berstatus "online"
        antiCall: true, // Bot secara otomatis membanned orang yang menelepon
        autoMention: true, // Bot otomatis mention seseorang dalam pesan yang dikirim
        autoRead: true, // Bot baca pesan otomatis
        autoTypingOnCmd: true, // Tampilkan status "sedang mengetik" saat memproses perintah
        cooldown: 10 * 1000, // Jeda antar perintah (ms)
        maxListeners: 50, // Max listeners untuk events
        port: 3000, // Port (Jika pakai server)
        reportErrorToOwner: true, // Laporkan error ke owner bot
        restrict: false, // Batasi akses perintah
        requireBotGroupMembership: false, // Harus gabung grup bot
        requireGroupSewa: false, // Harus sewa bot untuk bisa dipakai di grup
        selfOwner: false, // Bot jadi owner sendiri
        selfReply: true, // Bot bisa balas pesan bot sendiri
        timeZone: "Asia/Jakarta", // Zona waktu bot
        unavailableAtNight: false, // Bot tidak tersedia pada malam hari, dari jam 12 malam sampai 6 pagi (Waktu akan disesuaikan menurut timeZone)
        uploaderHost: "FastUrl", // Host uploader untuk menyimpan media (Tersedia: Catbox, Cloudku, FastUrl, Litterbox, Pomf, Quax, Ryzumi, Uguu, Videy)
        useCoin: true, // Pakai koin
        usePairingCode: false, // Pakai kode pairing untuk koneksi
        customPairingCode: "UMBR4L15", // Kode pairing kustom untuk koneksi (Opsional, jika menggunakan QR code, jika kosong kode pairing akan random)
        useServer: false // Jalankan bot dengan server
    }
};