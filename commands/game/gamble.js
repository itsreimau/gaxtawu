module.exports = {
    name: "gamble",
    category: "game",
    code: async (ctx) => {
        const input = parseInt(ctx.args[0], 10);

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "18")
            );

        const senderDb = ctx.db.user;

        if (ctx.sender.isOwner() || senderDb?.premium) return await ctx.reply(tools.msg.info("Koin tak terbatas tidak dapat digunakan untuk bermain."));
        if (input < 10) return await ctx.reply(tools.msg.info("Jumlah taruhan tidak boleh kurang dari 10!"));
        if (senderDb?.coin < input) return await ctx.reply(tools.msg.info("Koin Anda tidak mencukupi!"));

        try {
            const jackpot = Math.ceil(input * 5);
            const win = Math.ceil(input * 2);

            const emojis = ["🍒", "🍋", "🍊", "🍉", "🍇", "🔔", "⭐", "7️⃣", "💎", "🍓", "🥝", "🃏"];

            let matrix = [];
            for (let i = 0; i < 3; i++) {
                matrix[i] = [];
                for (let j = 0; j < 3; j++) {
                    const randomIndex = Math.floor(Math.random() * emojis.length);
                    matrix[i][j] = emojis[randomIndex];
                }
            }

            const row0 = matrix[0];
            const row1 = matrix[1];
            const row2 = matrix[2];

            const isJackpot = (row1[0] === row1[1] && row1[1] === row1[2]);
            const isWin = !isJackpot && ((row0[0] === row0[1] && row0[1] === row0[2]) || (row2[0] === row2[1] && row2[1] === row2[2]));

            const slotText = `${row0[0]} | ${row0[1]} | ${row0[2]}\n` +
                `${row1[0]} | ${row1[1]} | ${row1[2]} <===\n` +
                `${row2[0]} | ${row2[1]} | ${row2[2]}`;

            let responseText = "";
            let prizeText = "";

            if (isJackpot) {
                responseText = "Jackpot! 🎉🎉🎉";
                prizeText = `+${jackpot} Koin (5x lipat)`;
                senderDb.coin += jackpot;
                senderDb.save();
            } else if (isWin) {
                responseText = "Kamu Menang! 🍀";
                prizeText = `+${win} Koin (2x lipat)`;
                senderDb.coin += win;
                senderDb.save();
            } else {
                responseText = "Anda kalah! Semoga beruntung lain kali! 😢";
                prizeText = `-${input} Koin`;
                senderDb.coin -= input;
                senderDb.save();
            }

            await ctx.reply(
                `✿ — ${responseText}\n` +
                `${slotText}\n` +
                "\n" +
                `› Taruhan: ${input}\n` +
                `› Hadiah: ${prizeText}\n` +
                `› Sisa Koin: ${senderDb.coin}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};