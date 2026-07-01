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
        const isUnlimited = ctx.sender.isOwner() || senderDb?.premium;

        if (input < 10) return await ctx.reply(tools.msg.info("Jumlah taruhan tidak boleh kurang dari 10!"));
        if (!isUnlimited && senderDb?.coin < input) return await ctx.reply(tools.msg.info("Koin Anda tidak mencukupi!"));

        try {
            const jackpotPrize = Math.ceil(input * 5);
            const winPrize = Math.ceil(input * 2);

            const emojis = ["🍏", "🍎", "🍊", "🍋", "🍑", "🪙", "🍅", "🍐", "🍒", "🥥", "🍌"];

            let topRow = [];
            let middleRow = [];
            let bottomRow = [];

            for (let i = 0; i < 3; i++) {
                topRow[i] = emojis[Math.floor(Math.random() * emojis.length)];
                middleRow[i] = emojis[Math.floor(Math.random() * emojis.length)];
                bottomRow[i] = emojis[Math.floor(Math.random() * emojis.length)];
            }

            const isJackpot = (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]);
            const isWin = (middleRow[0] === middleRow[1] || middleRow[0] === middleRow[2] || middleRow[1] === middleRow[2]);

            const slotText = `${topRow[0]} | ${middleRow[0]} | ${bottomRow[0]}\n` +
                `${topRow[1]} | ${middleRow[1]} | ${bottomRow[1]} <===\n` +
                `${topRow[2]} | ${middleRow[2]} | ${bottomRow[2]}`;

            let responseText = "";

            if (isJackpot) {
                responseText = `Jackpot! +${jackpotPrize} koin (5x lipat)`;
                if (!isUnlimited) senderDb.coin += jackpotPrize;
            } else if (isWin) {
                responseText = `Menang! +${winPrize} koin (2x lipat)`;
                if (!isUnlimited) senderDb.coin += winPrize;
            } else {
                responseText = `Kalah! Semoga beruntung lain kali. -${input} koin`;
                if (!isUnlimited) senderDb.coin -= input;
            }

            if (!isUnlimited) senderDb.save();

            await ctx.reply(
                `${tools.msg.info(responseText)}\n` +
                slotText
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};