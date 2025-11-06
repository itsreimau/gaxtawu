// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const axios = require("axios");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";
        const createList = (data, list) => data.map(list).join("\n");

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://api-alkitab.vercel.app", "/api/book"))).data.data;
                text = createList(data, list =>
                    `➛ ${formatter.bold("Buku")}: ${list.name} (${list.abbr})\n` +
                    `➛ ${formatter.bold("Jumlah Bab")}: ${list.chapter}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("https://raw.githubusercontent.com", "/penggguna/QuranJSON/master/quran.json"))).data;
                text = createList(data, list =>
                    `➛ ${formatter.bold("Surah")}: ${list.name} (${list.number_of_surah}\n` +
                    `➛ ${formatter.bold("Jumlah Ayat")}: ${list.number_of_ayah}`
                );
                break;
            }
            case "claim": {
                const data = [
                    "daily (Hadiah harian)",
                    "weekly (Hadiah mingguan)",
                    "monthly (Hadiah bulanan)",
                    "yearly (Hadiah tahunan)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "group": {
                const data = [
                    "open (Buka grup)",
                    "close (Tutup grup)",
                    "lock (Kunci grup)",
                    "unlock (Buka kunci grup)",
                    "approve (Aktifkan persetujuan masuk)",
                    "disapprove (Nonaktifkan persetujuan masuk)",
                    "invite (Izinkan anggota menambah anggota)",
                    "restrict (Hanya admin yang bisa menambah anggota)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "mode": {
                const data = [
                    "premium (Mode premium, hanya merespons pengguna premium dan owner)",
                    "group (Mode group, hanya merespons dalam grup)",
                    "private (Mode private, hanya merespons dalam obrolan pribadi)",
                    "public (Mode publik, merespons dalam grup dan obrolan pribadi)",
                    "self (Mode self, hanya merespons dirinya sendiri dan owner)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "osettext": {
                const data = [
                    "donate - Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Atur teks donasi)",
                    "price - Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Atur teks harga)",
                    "qris (Atur gambar QRIS untuk donasi, gambar harus berupa link)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "setoption": {
                const data = [
                    "antiaudio (Anti audio)",
                    "Antidocument (Anti dokumen)",
                    "Antigif (Anti GIF)",
                    "Antiimage (Anti gambar)",
                    "antilink (Anti link)",
                    "antispam (Anti spam)",
                    "antisticker (Anti stiker)",
                    "antivideo (Anti video)",
                    "antitoxic (Anti toxic, seperti bahasa kasar)",
                    `autokick (Dikeluarkan secara otomatis, jika ada yang melanggar salah satu opsi ${formatter.inlineCode("anti...")})`,
                    "gamerestrict (Anggota dilarang bermain game)",
                    "welcome (Sambutan member)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Otomatis naik level)",
                    "username (Nama pengguna)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Teks goodbye, variabel yang tersedia: %tag%, %subject%, %description%)",
                    "intro (Teks intro)",
                    "welcome (Teks welcome, variabel yang tersedia: %tag%, %subject%, %description%)"
                ];
                text = createList(data, list => `➛ ${list}`);
                break;
            }
            default: {
                text = `ⓘ ${formatter.italic(`Tipe tidak diketahui: ${type}`)}`;
                break;
            }
        }

        return text;
    } catch (error) {
        consolefy.error(`Error: ${util.format(error)}`);
        return null;
    }
}

module.exports = {
    get
};