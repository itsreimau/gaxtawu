const axios = require("axios");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi", "infogempa"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const bmkgUrl = "https://data.bmkg.go.id";
            const apiUrl = tools.api.createUrl(bmkgUrl, "/DataMKG/TEWS/autogempa.json");
            const result = (await axios.get(apiUrl)).data.Infogempa.gempa;

            await ctx.reply({
                image: {
                    url: tools.api.createUrl(bmkgUrl, `/DataMKG/TEWS/${result.Shakemap}`)
                },
                mimetype: tools.mime.lookup("png"),
                caption: `${formatter.quote(`Wilayah: ${result.Wilayah}`)}\n` +
                    `${formatter.quote(`Tanggal: ${result.Tanggal}`)}\n` +
                    `${formatter.quote(`Potensi: ${result.Potensi}`)}\n` +
                    `${formatter.quote(`Magnitude: ${result.Magnitude}`)}\n` +
                    `${formatter.quote(`Kedalaman: ${result.Kedalaman}`)}\n` +
                    `${formatter.quote(`Koordinat: ${result.Coordinates}`)}\n` +
                    formatter.quote(`Dirasakan: ${result.Dirasakan}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};