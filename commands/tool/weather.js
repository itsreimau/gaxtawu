const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "bogor")
        );

        try {
            const apiUrl = tools.api.createUrl("izumi", "/lokasi/cuaca", {
                lokasi: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(
                `➛ ${formatter.bold("Lokasi")}: ${result.namaTempat} (${result.koordinat.latitude}, ${result.koordinat.longitude})\n` +
                `➛ ${formatter.bold("Cuaca")}: ${result.cuaca.deskripsi}\n` +
                `➛ ${formatter.bold("Suhu")}: ${result.cuaca.suhu}\n` +
                `➛ ${formatter.bold("Kelembaban")}: ${result.cuaca.kelembapan}\n` +
                `➛ ${formatter.bold("Angin")}: ${result.angin.kecepatan} (dari ${result.cuaca.angin.dari} ke ${result.cuaca.angin.ke})\n` +
                `➛ ${formatter.bold("Awan")}: ${result.cuaca.tutupanAwan}\n` +
                `➛ ${formatter.bold("Jarak Pandang")}: ${result.cuaca.jarakPandang.teks}\n` +
                `➛ ${formatter.bold("Terakhir diperbarui")}: ${moment.unix(result.cuaca.waktu).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm")} WIB`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};