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
            const jackpotPrize = Math.ceil(input * 5);
            const winPrize = Math.ceil(input * 2);

            const emojis = ["🍒", "🍋", "🍊", "🍉", "🍇", "🔔", "⭐", "7️⃣", "💎", "🍓", "🥝", "🃏"];

            const roll = Math.floor(Math.random() * 100) + 1;

            let resultType = "lose";
            if (roll <= 10) {
                resultType = "jackpot";
            } else if (roll <= 50) {
                resultType = "win";
            }

            const targetSymbol = emojis[Math.floor(Math.random() * emojis.length)];
            const randomSymbol = () => emojis[Math.floor(Math.random() * emojis.length)];

            let matrix = [];

            if (resultType === "jackpot") {
                for (let i = 0; i < 3; i++) {
                    matrix[i] = [targetSymbol, targetSymbol, targetSymbol];
                }
            } else if (resultType === "win") {
                for (let i = 0; i < 3; i++) {
                    matrix[i] = [randomSymbol(), randomSymbol(), randomSymbol()];
                }

                const winRow = Math.random() < 0.5 ? 0 : 2;
                matrix[winRow] = [targetSymbol, targetSymbol, targetSymbol];

                while (matrix[1][0] === matrix[1][1] && matrix[1][1] === matrix[1][2]) {
                    matrix[1] = [randomSymbol(), randomSymbol(), randomSymbol()];
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    matrix[i] = [randomSymbol(), randomSymbol(), randomSymbol()];
                }

                while (matrix[1][0] === matrix[1][1] && matrix[1][1] === matrix[1][2]) {
                    matrix[1] = [randomSymbol(), randomSymbol(), randomSymbol()];
                }
            }

            const row0 = matrix[0];
            const row1 = matrix[1];
            const row2 = matrix[2];

            const slotText = `${row0[0]} | ${row0[1]} | ${row0[2]}\n` +
                `${row1[0]} | ${row1[1]} | ${row1[2]} <===\n` +
                `${row2[0]} | ${row2[1]} | ${row2[2]}`;

            let responseText = "";
            let prizeText = "";

            if (resultType === "jackpot") {
                responseText = "Jackpot! 🎉🎉🎉";
                prizeText = `+${jackpotPrize} Koin (5x lipat)`;
                senderDb.coin += jackpotPrize;
            } else if (resultType === "win") {
                responseText = "Kamu Menang!";
                prizeText = `+${winPrize} Koin (2x lipat)`;
                senderDb.coin += winPrize;
            } else {
                responseText = "Anda kalah! Semoga beruntung lain kali!";
                prizeText = `-${input} Koin`;
                senderDb.coin -= input;
            }

            senderDb.save();

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