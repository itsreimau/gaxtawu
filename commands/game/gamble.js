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
        const isUnlimited = (ctx.sender.isOwner() || senderDb?.premium);

        if (input < 10) return await ctx.reply(tools.msg.info("Jumlah taruhan tidak boleh kurang dari 10!"));
        if (!isUnlimited && senderDb?.coin < input) return await ctx.reply(tools.msg.info("Koin Anda tidak mencukupi!"));

        try {
            const jackpotPrize = Math.ceil(input * 5);
            const winPrize = Math.ceil(input * 2);

            const emojis = ["🍏", "🍎", "🍊", "🍋", "🍑", "🪙", "🍅", "🍐", "🍒", "🥥", "🍌"];

            let topIndex = Math.floor(Math.random() * emojis.length);
            let middleIndex = Math.floor(Math.random() * emojis.length);
            let bottomIndex = Math.floor(Math.random() * emojis.length);

            let topRow = [],
                middleRow = [],
                bottomRow = [];

            for (let i = 0; i < 3; i++) {
                topRow[i] = emojis[topIndex];
                topIndex++;
                if (topIndex == emojis.length) topIndex = 0;
            }

            for (let i = 0; i < 3; i++) {
                middleRow[i] = emojis[middleIndex];
                middleIndex++;
                if (middleIndex == emojis.length) middleIndex = 0;
            }

            for (let i = 0; i < 3; i++) {
                bottomRow[i] = emojis[bottomIndex];
                bottomIndex++;
                if (bottomIndex == emojis.length) bottomIndex = 0;
            }

            const isJackpot = (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]);
            const isWin = (middleRow[0] === middleRow[1] || middleRow[0] === middleRow[2] || middleRow[1] === middleRow[2]);

            const slotText = `${topRow[0]} | ${middleRow[0]} | ${bottomRow[0]}\n` +
                `${topRow[1]} | ${middleRow[1]} | ${bottomRow[1]} <===\n` +
                `${topRow[2]} | ${middleRow[2]} | ${bottomRow[2]}`;

            let responseText = "";
            let prizeText = "";

            if (isJackpot) {
                responseText = "JACKPOT! 🎉🎉🎉";
                prizeText = `+${jackpotPrize} Koin (5x lipat)`;
                if (!isUnlimited) senderDb.coin += jackpotPrize;
            } else if (isWin) {
                responseText = "Kamu Menang!";
                prizeText = `+${winPrize} Koin (2x lipat)`;
                if (!isUnlimited) senderDb.coin += winPrize;
            } else {
                responseText = "Anda kalah! Semoga beruntung lain kali!";
                prizeText = `-${input} Koin`;
                if (!isUnlimited) senderDb.coin -= input;
            }

            if (!isUnlimited) senderDb.save();

            await ctx.reply(
                `✿ — ${responseText}\n` +
                `${slotText}\n` +
                "\n" +
                `› Taruhan: ${input}\n` +
                `› Hadiah: ${prizeText}\n` +
                `› Sisa Koin: ${isUnlimited ? "Tak terbatas (tidak mengurangi/menambah koin)" : senderDb.coin}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};