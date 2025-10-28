const axios = require("axios");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi", "infogempa"],
    category: "tool",
    permissions: {
        coin: 5
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
                caption: `➛ ${formatter.bold("Wilayah")}: ${result.title}\n` +
                    `➛ ${formatter.bold("Tanggal")}: ${result.Tanggal}\n` +
                    `➛ ${formatter.bold("Potensi")}: ${result.Potensi}\n` +
                    `➛ ${formatter.bold("Magnitude")}: ${result.Magnitude}\n` +
                    `➛ ${formatter.bold("Kedalaman")}: ${result.Kedalaman}\n` +
                    `➛ ${formatter.bold("Koordinat")}: ${result.Coordinates}\n` +
                    `➛ ${formatter.bold("Dirasakan")}: ${result.Dirasakan}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};