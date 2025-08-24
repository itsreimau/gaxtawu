# gaxtawu

`gaxtawu` adalah bot WhatsApp yang menggunakan [@rexxhayanasi/elaina-bail](https://www.npmjs.com/package/@rexxhayanasi/elaina-bail). Bot ini dirancang untuk mengotomatisasi berbagai tugas di WhatsApp, serta mendukung arsitektur modular melalui sistem perintah (command), sehingga memudahkan pengembangan dan pemeliharaan fitur.

## Disclaimer

`gaxtawu` **tidak berafiliasi dengan WhatsApp, Meta, atau pihak manapun**. Ini adalah proyek **open-source** yang dibuat untuk keperluan edukasi dan pengembangan.

Bot ini menggunakan **API tidak resmi (Unofficial WhatsApp API)**, sehingga **berpotensi menyebabkan akun WhatsApp dibanned**.

Gunakan dengan bijak dan tanggung sendiri risikonya. Kami **tidak bertanggung jawab atas penyalahgunaan atau kerugian yang ditimbulkan** dari penggunaan proyek ini.

## Key Features

- **Penanganan Pesan:** Bot dapat menangani pesan yang masuk dan memberikan respons sesuai kebutuhan.
- **Penanganan Perintah:** Bot dapat menangani perintah yang dikirim oleh pengguna dan menjalankan tindakan yang sesuai.
- **Respon Interaktif:** Bot memberikan tanggapan dinamis dan interaktif terhadap pertanyaan atau perintah pengguna.
- **Penanganan Media:** Mendukung pengiriman dan penerimaan berbagai media seperti gambar, video, dan dokumen.
- **Sistem Perintah Modular:** Bot mudah diperluas dengan menambahkan perintah baru sesuai kebutuhanmu.

## How to Get Started

Ikuti langkah-langkah berikut untuk mengatur dan menjalankan `gaxtawu`:

### 1. Cloning Repository

Pertama, kloning repositori dan masuk ke direktori proyek:

```bash
git clone https://github.com/itsreimau/gaxtawu.git
cd gaxtawu
```

### 2. Dependency Installation

Instal semua dependensi yang dibutuhkan dengan perintah berikut:

```bash
npm install
```

### 3. Configuration

Ganti nama file `config.example.js` menjadi `config.js`, lalu sesuaikan konfigurasi seperti nama bot, pesan default, nomor owner bot, dan lain-lain.

## Authentication Adapter

`gaxtawu` mendukung penyimpanan sesi autentikasi menggunakan pilihan database: **MySQL**, **MongoDB**, dan **Firebase**. Pilih dan atur database sesuai preferensimu dengan langkah-langkah berikut:

### 1. Select Database Adapter

Pada file konfigurasi `config.js`, sesuaikan bagian `authAdapter` dengan adapter database yang kamu pilih.

### 2. Install Database Module

Setelah memilih adapter yang diinginkan, jalankan perintah berikut untuk menginstal modul yang diperlukan:

```bash
npm run install:adapter
```

Perintah ini akan menginstal modul yang sesuai dengan konfigurasi adapter yang kamu pilih.

### 3. Make sure Database is Active

Pastikan server databasemu aktif dan dapat diakses sebelum menjalankan bot. Periksa hal-hal berikut:

- Untuk **MySQL**, pastikan kredensial pengguna dan nama database benar.
- Untuk **MongoDB**, pastikan URL yang dimasukkan dapat terhubung ke server MongoDB.
- Untuk **Firebase**, pastikan kredensial akun layanan yang diunduh dari Google Firebase Console telah dimasukkan dengan benar.

## Running Bot

Setelah konfigurasi selesai, kamu dapat menjalankan bot dengan dua opsi berikut:

### 1. Run Directly

Untuk menjalankan bot secara langsung di terminal, gunakan perintah:

```bash
npm start
```

Bot akan berjalan hingga kamu menutup terminal atau menghentikannya secara manual.

### 2. Run with PM2

Jika kamu ingin menjalankan bot sebagai layanan latar belakang (background process) yang tetap aktif meskipun terminal ditutup, gunakan PM2:

```bash
npm run start:pm2
```

## WhatsApp Authentication

Ada dua metode autentikasi yang dapat digunakan untuk menghubungkan bot ke akun WhatsAppmu:

### 1. Using Pairing Code

- Setelah bot dijalankan, kode pairing akan ditampilkan di terminal.
- Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
- Masukkan kode pairing yang ditampilkan di terminal untuk menautkan akun WhatsApp dengan bot.

### 2. Using QR Code

- Setelah bot dijalankan, kode QR akan muncul di terminal.
- Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
- Pindai kode QR yang muncul di terminal untuk menautkan akun WhatsApp dengan bot.

Setelah proses autentikasi berhasil, bot siap untuk menerima dan merespons pesan sesuai dengan perintah yang diberikan.

## Customization

### Added New Commands

Untuk menambahkan perintah baru, ikuti langkah-langkah berikut:

1. Buat file JavaScript baru di folder `commands` dengan fungsionalitas yang diinginkan. Misalnya, buat file `test/helloworld.js`:

   ```javascript
   // commands/test/helloworld.js

   module.exports = { // Mengatur dan membagikan fungsi untuk perintah "helloworld"
       name: "helloworld", // Nama perintah yang akan digunakan oleh pengguna
       aliases: ["hello"], // Nama alternatif yang bisa digunakan untuk memanggil perintah ini
       category: "test", // Kategori untuk mengelompokkan perintah ini
       permissions: { // Pengaturan khusus untuk perintah ini
           admin: Boolean, // Apakah hanya admin grup yang bisa menggunakan perintah ini? (true/false)
           botAdmin: Boolean, // Apakah bot harus menjadi admin agar bisa menjalankan perintah ini? (true/false)
           coin: Number, // Jumlah koin yang diperlukan untuk menjalankan perintah ini
           group: Boolean, // Apakah perintah ini hanya bisa digunakan di dalam grup? (true/false)
           owner: Boolean, // Apakah hanya owner bot yang bisa menggunakan perintah ini? (true/false)
           premium: Boolean, // Apakah hanya pengguna premium yang bisa menggunakan perintah ini? (true/false)
           private: Boolean // Apakah perintah ini hanya bisa digunakan dalam chat pribadi? (true/false)
       },
       code: async (ctx) => { // Fungsi yang dijalankan saat perintah ini dipanggil
           await ctx.reply("Hello, World!"); // Kirim pesan "Hello, World!" kepada pengguna
       }
   };
   ```

2. Perintah ini dapat dipicu dengan mengirimkan `/helloworld` di chat.

### Complete Documentation

`gaxtawu` menggunakan versi modifikasi dari `@mengkodingan/ckptw` yang telah difork dan disesuaikan khusus untuk bot ini. Library ini dibangun di atas `@rexxhayanasi/elaina-bail` yang menawarkan fitur lebih lengkap dibanding `@whiskeysockets/baileys`.

#### Perbedaan Utama dengan Versi Original:

- **Bug fixes** yang belum diatasi di versi original
- **Optimasi khusus** untuk kebutuhan `gaxtawu`

Untuk dokumentasi lengkap, silakan kunjungi:

- [@mengkodingan/ckptw](https://www.npmjs.com/package/@mengkodingan/ckptw) - Referensi dasar struktur command
- [itsreimau/gktw](https://github.com/itsreimau/gktw) **(Fork Resmi untuk gaxtawu)** - Dokumentasi versi custom yang digunakan
- [@rexxhayanasi/elaina-bail](https://www.npmjs.com/package/@rexxhayanasi/elaina-bail) - Panduan pengiriman pesan/media

## Contribution

Kami sangat terbuka untuk kontribusi! Jika kamu menemukan bug atau memiliki ide untuk fitur baru, jangan ragu untuk membuka issue atau mengirimkan pull request.

## License

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).