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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("izumi", "/lokasi/cekcuaca", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                text: `${formatter.quote(`Lokasi: ${result.namaTempat}`)}\n` +
                    `${formatter.quote(`Koordinat: ${result.koordinat.latitude}, ${result.koordinat.longitude}`)}\n` +
                    `${formatter.quote(`Terakhir diperbarui: ${moment.unix(result.cuaca.waktu).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm")} WIB`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    `${formatter.quote(`Cuaca: ${result.cuaca.deskripsi}`)}\n` +
                    `${formatter.quote(`Suhu: ${result.cuaca.suhu}`)}\n` +
                    `${formatter.quote(`Kelembaban: ${result.cuaca.kelembapan}%`)}\n` +
                    `${formatter.quote(`Angin: ${result.angin.kecepatan} (dari ${result.cuaca.angin.dari} ke ${result.cuaca.angin.ke})`)}\n` +
                    `${formatter.quote(`Awan: ${result.cuaca.tutupanAwan}`)}\n` +
                    formatter.quote(`Jarak Pandang: ${result.cuaca.jarakPandang.teks}`)
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};