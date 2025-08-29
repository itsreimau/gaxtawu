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
            const apiUrl = tools.api.createUrl("diibot", "/api/tools/cekcuaca", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                text: `${formatter.quote(`Lokasi: ${result.name}, ${result.sys.country}`)}\n` +
                    `${formatter.quote(`Koordinat: ${result.coord.lat}, ${result.coord.lon}`)}\n` +
                    `${formatter.quote(`Terakhir diperbarui: ${moment.unix(result.dt).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm")} WIB`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    `${formatter.quote(`Cuaca: ${tools.msg.ucwords(result.weather[0].description)}`)}\n` +
                    `${formatter.quote(`Suhu: ${result.main.temp}°C (Min ${result.main.temp_min}°C | Max ${result.main.temp_max}°C)`)}\n` +
                    `${formatter.quote(`Terasa seperti: ${result.main.feels_like}°C`)}\n` +
                    `${formatter.quote(`Kelembaban: ${result.main.humidity}%`)}\n` +
                    `${formatter.quote(`Tekanan Udara: ${result.main.pressure} hPa`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    `${formatter.quote(`Angin: ${result.wind.speed} m/s (${(result.wind.speed * 3.6).toFixed(1)} km/h)`)}\n` +
                    `${formatter.quote(`Arah Angin: ${result.wind.deg}°`)}\n` +
                    `${formatter.quote(`Hembusan: ${result.wind.gust} m/s`)}\n` +
                    `${formatter.quote("· · ─ ·✶· ─ · ·")}\n` +
                    `${formatter.quote(`Awan: ${result.clouds.all}%`)}\n` +
                    `${formatter.quote(`Jarak Pandang: ${(result.visibility/1000).toFixed(1)} km`)}\n` +
                    `${formatter.quote(`Matahari Terbit: ${moment.unix(result.sys.sunrise).tz("Asia/Jakarta").format("HH:mm")} WIB`)}\n` +
                    formatter.quote(`Matahari Terbenam: ${moment.unix(result.sys.sunset).tz("Asia/Jakarta").format("HH:mm")} WIB`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};