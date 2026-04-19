const axios = require("axios");

module.exports = {
    name: "iptrack",
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "1.1.1.1")
            );

        try {
            const apiUrl = tools.api.createUrl("izukumii", "/tools/ipTrack", {
                ip: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(
                `➛ ${formatter.bold("IP")}: ${result.query}\n` +
                `➛ ${formatter.bold("Negara")}: ${result.country} (${result.countryCode})\n` +
                `➛ ${formatter.bold("Region")}: ${result.regionName} (${result.region})\n` +
                `➛ ${formatter.bold("Kota")}: ${result.city}\n` +
                `➛ ${formatter.bold("Kode Pos")}: ${result.zip}\n` +
                `➛ ${formatter.bold("Lokasi")}: ${result.lat}, ${result.lon}\n` +
                `➛ ${formatter.bold("Zona Waktu")}: ${result.timezone}\n` +
                `➛ ${formatter.bold("ISP")}: ${result.isp}\n` +
                `➛ ${formatter.bold("Organisasi")}: ${result.org}\n` +
                `➛ ${formatter.bold("AS")}: ${result.as}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};