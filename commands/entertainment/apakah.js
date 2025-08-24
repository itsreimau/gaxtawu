module.exports = {
    name: "apakah",
    aliases: ["apa"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion itu peak?"))
        );

        try {
            const answers = ["Ya", "Yoi", "Iya dong", "Tentu", "Pasti", "Udah pasti", "Fix banget", "Gas!", "Seriusan iya", "Jelas lah", "Iyain aja deh", "Mungkin", "Mungkin iya", "Mungkin nggak", "Kayaknya iya", "Kayaknya enggak", "50:50", "Bisa jadi", "Entahlah", "Tergantung mood", "Tergantung siapa yang nanya", "Kondisional banget nih", "Gatau sih, cobain aja dulu", "Masih dipikirin", "Belum kepikiran", "Ntar dulu ya", "Hmm...", "Enggak dulu deh", "Tidak", "Ogah", "Nggak lah", "Nope", "Nggak mungkin", "Mustahil sih", "Apaan sih", "Waduh jangan", "Lah kok gitu?", "Emangnya bisa?", "Lu ngimpi ya?", "Hehe... ngarep", "Gitu amat yak", "Lu pikir gampang?", "Beneran nanya nih?", "Yaelah bro", "Ngaco lu", "Coba ulang pertanyaannya deh", "Nggak yakin banget", "Serius lo?", "Gajelas"];
            const result = tools.cmd.getRandomElement(answers);

            await ctx.reply(formatter.quote(result));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};