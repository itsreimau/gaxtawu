module.exports = {
    name: "iqtest",
    aliases: ["iq", "testiq"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const winGame = await db.get(`user.${ctx.getId(ctx.sender.jid)}.winGame`) || 0;

        let iqScore;
        let feedback;

        if (winGame < 5) {
            iqScore = Math.floor(Math.random() * 50) + 1;
            feedback = iqScore < 50 ? "Hmm, mungkin kamu harus mencobanya lagi? Jangan menyerah!" : "Cukup bagus, terus bermain untuk meningkatkan keterampilan kamu!";
        } else if (winGame < 20) {
            iqScore = Math.floor(Math.random() * 50) + 51;
            feedback = iqScore < 100 ? "Tidak buruk, tapi kamu bisa melakukannya lebih baik!" : "Kamu semakin pintar! Pertahankan momentum!";
        } else {
            iqScore = Math.floor(Math.random() * 50) + 101;
            feedback = iqScore < 150 ? "Luar biasa! Kamu di atas rata-rata!" : "Wah, kamu jenius luar biasa! Kemenanganmu sangat mengesankan!";
        }

        await ctx.reply(formatter.quote(`🧠 IQ-mu sebesar: ${iqScore}. ${feedback}`));
    }
};