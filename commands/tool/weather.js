const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "bogor")
            );

        try {
            const apiUrl = tools.api.createUrl("nexray", "/information/cuaca", {
                kota: input
            });
            const result = (await axios.get(apiUrl)).data.result.forecasts;

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Waktu")}: ${res.waktu}\n` +
                `➛ ${formatter.bold("Cuaca")}: ${res.cuaca}\n` +
                `➛ ${formatter.bold("Suhu")}: ${res.suhu}\n` +
                `➛ ${formatter.bold("Kelembaban")}: ${res.kelembaban}\n` +
                `➛ ${formatter.bold("Kecepatan Angin")}: ${res.kecepatan_angin}\n` +
                `➛ ${formatter.bold("Arah Angin")}: ${res.arah_angin}\n` +
                `➛ ${formatter.bold("Visibilitas")}: ${res.visibilitas}`
            ).join("\n\n");
            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};