// Konfigurasi
global.config = {
    // Informasi bot dasar
    bot: {
        name: "GAXTAWU", // Nama bot
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Karakter awalan untuk memanggil perintah
        phoneNumber: "", // Nomor telepon bot (Tidak perlu diisi jika menggunakan QR code)
        thumbnail: "https://repository-images.githubusercontent.com/753096396/3f4b7686-0f1d-43f2-8293-2ae1b4487220", // Gambar thumbnail bot
        groupJid: "", // JID untuk group bot (Tidak perlu diisi jika tidak menggunakan requireBotGroupMembership)
        newsletterJid: "120363416372653441@newsletter" // JID untuk saluran bot
    },

    // Pesan bot yang disesuaikan untuk situasi tertentu
    msg: {
        admin: "Perintah hanya dapat diakses oleh admin grup!", // Pesan saat perintah hanya untuk admin
        banned: "Anda telah dibanned oleh Owner!", // Pesan untuk pengguna yang dibanned
        botAdmin: "Bot bukan admin grup ini.", // Pesan jika bot bukan admin di grup
        botGroupMembership: "Anda tidak bergabung dengan grup bot.", // Pesan jika pengguna tidak bergabung dengan grup bot
        coin: "Koin Anda tidak cukup.", // Pesan saat koin tidak cukup
        cooldown: "Perintah ini sedang dalam cooldown, tunggu...", // Pesan saat cooldown perintah
        gamerestrict: "Grup ini membatasi game.", // Pesan jika grup membatasi game
        group: "Perintah hanya dapat diakses dalam grup!", // Pesan untuk perintah grup
        groupSewa: "Bot tidak aktif karena grup ini belum melakukan sewa.", // Pesan jika grup belum melakukan sewa
        owner: "Perintah hanya dapat diakses Owner!", // Pesan untuk perintah yang hanya owner bisa akses
        premium: "Anda bukan pengguna Premium!", // Pesan jika pengguna bukan premium
        private: "Perintah hanya dapat diakses dalam obrolan pribadi!", // Pesan untuk perintah obrolan pribadi
        privatePremiumOnly: "Menggunakan bot dalam obrolan pribadi hanya untuk pengguna Premium.", // Pesan jika pengguna bukan premium menggunakan bot dalam obrolan pribadi
        restrict: "Perintah ini telah dibatasi karena alasan keamanan!", // Pesan pembatasan perintah
        unavailableAtNight: "Bot tidak tersedia dari jam 12 malam sampai 6 pagi. Silakan kembali nanti!", // Pesan jika tidak tersedia pada malam hari

        readmore: "\u200E".repeat(4001), // Read more...
        note: "“Lorem ipsum dolor sit amet, tenebris in umbra, vitae ad mortem.”", // Catatan
        footer: "Developed by ItsReimau with ♡", // Catatan kaki

        wait: "Tunggu sebentar...", // Pesan loading
        notFound: "Tidak ada yang ditemukan! Coba lagi nanti.", // Pesan item tidak ditemukan
        urlInvalid: "URL tidak valid!" // Pesan jika URL tidak valid
    },

    // Informasi owner bot
    owner: {
        name: "Budi", // Nama owner bot
        organization: "PT. Pencari Cinta Sejati", // Nama organisasi owner bot
        id: "62123456789", // Nomor telepon owner bot
        co: [{
            name: "Budi Jr.",
            organization: "PT. Pencari Cinta Sejati II",
            id "62987654321"
        }] // Nomor co-owner bot
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
        autoRead: true, // Bot baca pesan otomatis
        autoAiLabel: true, // Bot otomatis menambahkan label AI dalam pesan yang dikirim
        autoTypingOnCmd: true, // Tampilkan status "sedang mengetik" saat memproses perintah
        cooldown: 10 * 1000, // Jeda antar perintah (ms)
        maxListeners: 50, // Max listeners untuk events
        port: 3000, // Port (Jika pakai server)
        privatePremiumOnly: false, // Pengguna bukan premium tidak diperbolehkan menggunakan bot dalam percakapan pribadi
        restrict: false, // Batasi akses perintah
        requireBotGroupMembership: false, // Harus gabung grup bot
        requireGroupSewa: false, // Harus sewa bot untuk bisa dipakai di grup
        reportErrorToOwner: true, // Laporkan error ke owner bot
        selfOwner: false, // Bot jadi owner
        selfReply: true, // Bot bisa balas pesan bot sendiri
        timeZone: "Asia/Jakarta", // Zona waktu bot
        unavailableAtNight: false, // Bot tidak tersedia pada malam hari, dari jam 12 malam sampai 6 pagi (Waktu akan disesuaikan menurut timeZone)
        useCoin: true, // Pakai koin
        usePairingCode: false, // Pakai kode pairing untuk koneksi
        customPairingCode: "UMBR4L15", // Kode pairing kustom untuk koneksi (Opsional, jika menggunakan QR code, jika kosong kode pairing akan random)
        useStore: false, // Store untuk menyimpan pesan masuk
        useServer: false // Jalankan bot dengan server
    }
};