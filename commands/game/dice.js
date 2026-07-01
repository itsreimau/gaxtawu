module.exports = {
    name: "dice",
    category: "game",
    code: async (ctx) => {
        const input = parseInt(ctx.args[0]);

        if (isNaN(input) || input < 1 || input > 6)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "4")}\n` +
                tools.msg.generateNotes([
                    "Tebak angka dadu antara 1-6."
                ])
            );

        const senderDb = ctx.db.user;
        const isUnlimited = ctx.sender.isOwner() || senderDb?.premium;

        if (!isUnlimited && senderDb?.coin < 500) return await ctx.reply(tools.msg.info("Koin Anda tidak cukup! Minimal memiliki 500 koin untuk bermain."));

        try {
            const result = Math.floor(Math.random() * 6) + 1;
            const isWin = input === result;

            let responseText = "";
            let prizeText = "";

            if (isWin) {
                const prize = 1000;
                if (!isUnlimited) senderDb.coin += prize;
                responseText = "Selamat!";
                prizeText = `+${prize} koin`;
            } else {
                const forfeit = 500;
                if (!isUnlimited) senderDb.coin -= forfeit;
                responseText = "Kalah!";
                prizeText = `-${forfeit} koin`;
            }

            if (!isUnlimited) senderDb.save();

            await ctx.reply(tools.msg.info(`${responseText} Dadu menunjukkan angka ${result}. ${prizeText}`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};