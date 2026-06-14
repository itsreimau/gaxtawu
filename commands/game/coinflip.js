module.exports = {
    name: "coinflip",
    category: "game",
    code: async (ctx) => {
        const input = ctx.args[0]?.toLowerCase();

        if (!input || !["garuda", "melati"].includes(input))
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "melati")}\n` +
                tools.msg.generateNotes([
                    "Sisi koin tersedia garuda atau melati, sama seperti koin Rp. 500."
                ])
            );

        const senderDb = ctx.db.user;
        const isUnlimited = (ctx.sender.isOwner() || senderDb?.premium);

        if (!isUnlimited && senderDb?.coin < 500) return await ctx.reply(tools.msg.info("Koin Anda tidak cukup! Minimal memiliki 500 koin untuk bermain."));

        try {
            const flip = Math.random() < 0.5 ? "garuda" : "melati";
            const isWin = input === flip;

            let responseText = "";
            let prizeText = "";

            if (isWin) {
                const prize = 1000;
                if (!isUnlimited) senderDb.coin += prize;
                responseText = "SELAMAT! 🎉";
                prizeText = `+${prize} Koin`;
            } else {
                const forfeit = 500;
                if (!isUnlimited) senderDb.coin -= forfeit;
                responseText = "Kalah!";
                prizeText = `-${forfeit} Koin`;
            }

            if (!isUnlimited) senderDb.save();

            await ctx.reply(
                `✿ — ${responseText}\n` +
                `Koin jatuh di sisi ${flip}.\n` +
                "\n" +
                `› Pilihan: ${input}\n` +
                `› Hadiah: ${prizeText}\n` +
                `› Sisa Koin: ${isUnlimited ? "Tak terbatas (tidak mengurangi/menambah koin)" : senderDb.coin}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};