module.exports = {
    name: "iqtest",
    aliases: ["iq", "testiq"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const winGame = ctx.db.user.winGame || 0;

        let iqScore;
        let feedback;

        if (winGame < 5) {
            iqScore = Math.floor(Math.random() * 50) + 1;
            feedback = iqScore < 50 ? "Jangan menyerah!" : "Cukup bagus...";
        } else if (winGame < 20) {
            iqScore = Math.floor(Math.random() * 50) + 51;
            feedback = iqScore < 100 ? "Tidak buruk, tetapi Anda bisa melakukannya lebih baik!" : "Anda makin pintar, lanjutkan!";
        } else {
            iqScore = Math.floor(Math.random() * 50) + 101;
            feedback = iqScore < 150 ? "Keren! Anda di atas rata-rata!" : "Wah, Anda jenius!";
        }

        await ctx.reply(formatter.quote(`🧠 IQ Anda sebesar: ${iqScore}. ${feedback}`));
    }
};