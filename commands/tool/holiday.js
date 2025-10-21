const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    name: "holiday",
    aliases: ["harilibur", "libur"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const month = new Date().getMonth() + 1;
        const apiUrl = tools.api.createUrl("https://dayoffapi.vercel.app", "/api", {
            month
        });

        try {
            const result = (await axios.get(apiUrl)).data;

            const resultText = result.reverse().map(res => {
                const formattedDate = moment.tz(res.tanggal, "Asia/Jakarta").locale("id").format("dddd, DD MMMM YYYY");
                return `${res.keterangan}\n` +
                    formattedDate;
            }).join("\n");
            await ctx.reply({
                text: resultText || `ⓘ ${formatter.italic(config.msg.notFound)}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};