# gaxtawu - Useless WhatsApp Bot

> [!WARNING]
>
> `gaxtawu` **tidak berafiliasi dengan WhatsApp, Meta, atau pihak terkait mana pun**. Ini adalah **proyek sumber terbuka** yang dibuat untuk tujuan edukasi dan pengembangan.
>
> Bot ini menggunakan **API WhatsApp tidak resmi**, yang berarti **akun WhatsApp Anda berpotensi diblokir**.
>
> Gunakan dengan bertanggung jawab dan risiko Anda sendiri. Kami **tidak bertanggung jawab atas penyalahgunaan atau kerusakan** yang diakibatkan dari penggunaan proyek ini.

## 🚀 Getting Started

Ikuti langkah-langkah ini untuk menyiapkan dan menjalankan `gaxtawu`:

### 1. Clone Repository

Klon repositori dan navigasi ke direktori proyek:

```bash
git clone https://github.com/itsreimau/gaxtawu.git
cd gaxtawu
```

Jika Anda ingin melewati langkah 2 dan 3:

```bash
npm run setup
```

### 2. Install Dependencies

Instal semua dependensi yang diperlukan:

```bash
npm install
```

### 3. Configuration

Ubah nama `config.example.json` menjadi `config.json` dan sesuaikan konfigurasi termasuk nama bot, pesan default, nomor pemilik, dll.

## ▶️ Running the Bot

Setelah konfigurasi, Anda dapat menjalankan bot menggunakan salah satu metode:

### 1. Run Directly

Jalankan bot langsung di terminal:

```bash
npm start
```

### 2. Run with PM2

Jalankan bot sebagai layanan latar belakang menggunakan PM2:

```bash
npm run start:pm2
```

## 🔐 WhatsApp Authentication

Dua metode autentikasi tersedia:

### 1. Using Pairing Code

- Setelah memulai bot, kode pairing akan muncul di terminal
- Buka WhatsApp di ponsel Anda, buka **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**
- Masukkan kode pairing dari terminal

### 2. Using QR Code

- Setelah memulai bot, kode QR akan muncul di terminal
- Buka WhatsApp di ponsel Anda, buka **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**
- Pindai kode QR dari terminal

Setelah autentikasi berhasil, bot siap untuk menerima dan membalas pesan.

## 🛠️ Customization

### Adding New Commands

Untuk menambah perintah baru:

1. Buat file JavaScript baru di folder `commands`:

```javascript
// commands/test/helloworld.js

module.exports = {
    name: "helloworld",
    aliases: ["hello"],
    category: "test",
    permissions: {
        admin: Boolean,
        botAdmin: Boolean,
        coin: Number,
        group: Boolean,
        owner: Boolean,
        premium: Boolean,
        private: Boolean
    },
    code: async (ctx) => {
        await ctx.reply("Hello, World!");
    }
};
```

2. Perintah dapat dipicu dengan mengirim `/helloworld` di chat.

### Documentation

`gaxtawu` menggunakan versi modifikasi dari `@mengkodingan/ckptw` yang khusus di-fork dan disesuaikan untuk bot ini. Pustaka ini dibangun di atas `@rexxhayanasi/elaina-baileys` yang menawarkan fitur lebih lengkap dibandingkan `@whiskeysockets/baileys`.

Untuk dokumentasi lengkap, silakan kunjungi:

- [@mengkodingan/ckptw](https://www.npmjs.com/package/@mengkodingan/ckptw) - Referensi struktur perintah dasar
- [itsreimau/gktw](https://github.com/itsreimau/gktw) - Dokumentasi fork kustom
- [@rexxhayanasi/elaina-baileys](https://www.npmjs.com/package/@rexxhayanasi/elaina-baileys) - Panduan pengiriman pesan/media

## 🤝 Contribution

Kami menerima kontribusi! Jika Anda menemukan bug atau memiliki ide fitur, jangan ragu untuk membuka issue atau mengirim pull request.

## 📄 License

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).