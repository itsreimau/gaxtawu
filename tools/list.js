// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const axios = require("axios");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";
        const createList = (data, list) => data.map(list).join(`\n${formatter.quote("─────")}\n`);

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://api-alkitab.vercel.app", "/api/book"))).data.data;
                text = createList(data, list =>
                    `${formatter.quote(`Buku: ${list.name} (${list.abbr})`)}\n` +
                    `${formatter.quote(`Jumlah Bab: ${list.chapter}`)}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("neko", "/religious/nuquran-listsurah"))).data.result.list;
                text = createList(data, list =>
                    `${formatter.quote(`Surah: ${list.name} (${list.id})`)}\n` +
                    `${formatter.quote(`Jumlah Ayat: ${list.verse_count}`)}`
                );
                break;
            }
            case "cecan": {
                const data = ["china", "indonesia", "japan", "vietnam", "korea", "malaysia", "thailand"];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "claim": {
                const data = [
                    "daily (Hadiah harian)",
                    "weekly (Hadiah mingguan)",
                    "monthly (Hadiah bulanan)",
                    "yearly (Hadiah tahunan)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "fixdb": {
                const data = [
                    "user (Data pengguna)",
                    "group (Data grup)",
                    "menfess (Data menfess)"
                ];
                text = createList(data, list => formatter.quote(list));
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
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "how": {
                const data = [
                    "howgay (Seberapa gay)",
                    "howpintar (Seberapa pintar)",
                    "howcantik (Seberapa cantik)",
                    "howganteng (Seberapa ganteng)",
                    "howgabut (Seberapa gabut)",
                    "howgila (Seberapa gila)",
                    "howlesbi (Seberapa lesbi)",
                    "howstress (Seberapa stress)",
                    "howbucin (Seberapa bucin)",
                    "howjones (Seberapa jones)",
                    "howsadboy (Seberapa sadboy)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "mode": {
                const data = [
                    "group (Mode group, hanya merespons dalam obrolan grup)",
                    "private (Mode private, hanya merespons dalam obrolan pribadi)",
                    "public (Mode publik, merespons dalam obrolan grup dan obrolan pribadi)",
                    "self (Mode self, hanya merespons dirinya sendiri dan ownernya)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "nsfwhub": {
                const data = ["anal", "ass", "bdsm", "black", "blowjub", "boobs", "bottomless", "collared", "cum", "cumsluts", "dick", "dom", "dp", "easter", "extreme", "feet", "finger", "fuck", "futa", "gay", "group", "hentai", "kiss", "lesbian", "lick", "pegged", "puffies", "pussy", "real", "sixtynine", "suck", "tattoo", "tiny", "xmas"];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "osettext": {
                const data = [
                    "donate - Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Atur teks donasi)",
                    "price - Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Atur teks harga)",
                    "qris (Atur gambar QRIS untuk donasi, gambar harus berupa link)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "setoption": {
                const data = [
                    "antiaudio (Anti audio)",
                    "Antidocument (Anti dokumen)",
                    "Antigif (Anti GIF)",
                    "Antiimage (Anti gambar)",
                    "antilink (Anti link)",
                    "antinsfw (Anti NSFW, seperti pornografi)",
                    "antispam (Anti spam)",
                    "antisticker (Anti stiker)",
                    "antivideo (Anti video)",
                    "antitoxic (Anti toxic, seperti bahasa kasar)",
                    `autokick (Dikeluarkan secara otomatis, jika ada yang melanggar salah satu opsi ${formatter.inlineCode("anti...")})`,
                    "gamerestrict (Anggota dilarang bermain game)",
                    "welcome (Sambutan member)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Otomatis naik level)",
                    "username (Nama pengguna)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Teks goodbye, variabel yang tersedia: %tag%, %subject%, %description%)",
                    "intro (Teks intro)",
                    "welcome (Teks welcome, variabel yang tersedia: %tag%, %subject%, %description%)"
                ];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("https://raw.githubusercontent.com", "/itsecurityco/to-google-translate/refs/heads/master/supported_languages.json"))).data;
                text = createList(data, list =>
                    `${formatter.quote(`Kode: ${list.code}`)}\n` +
                    `${formatter.quote(`Bahasa: ${list.language}`)}`
                );
                break;
            }
            case "waifuim": {
                const data = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "waifupics": {
                const data = ["waifu", "neko", "shinobu", "megumin"];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            case "waifupicsnsfw": {
                const data = ["waifu", "neko", "trap"];
                text = createList(data, list => formatter.quote(list));
                break;
            }
            default: {
                text = formatter.quote(`❎ Tipe tidak diketahui: ${type}`);
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