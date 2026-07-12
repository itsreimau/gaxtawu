module.exports = {
    name: "vccgenerator",
    aliases: ["vccgen"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        let input = {
            "visa": "Visa",
            "mastercard": "MasterCard",
            "amex": "Amex",
            "cup": "CUP",
            "jcb": "JCB",
            "diners": "Diners",
            "rupay": "RuPay",
            "list": "list"
        } [ctx.text?.toLowerCase()];

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "mastercard")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("vccgenerator");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/tools/vccgen", {
                type: input
            });
            const result = (await axios.get(apiUrl)).data.result.cards;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Nomor Kartu")}: ${res.card_number}\n` +
                `❖ ${formatter.bold("Kedaluwarsa")}: ${res.expiration_date}\n` +
                `❖ ${formatter.bold("Pemegang Kartu")}: ${res.cardholder_name}\n` +
                `❖ ${formatter.bold("CVV")}: ${res.cvv}`
            ).join("\n\n");
            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};