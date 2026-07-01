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
            const result = (await axios.get(`${bmkgUrl}/DataMKG/TEWS/autogempa.json`)).data.Infogempa.gempa;

            await ctx.reply({
                image: {
                    url: `${bmkgUrl}/DataMKG/TEWS/${result.Shakemap}`
                },
                caption: `❖ ${formatter.bold("Wilayah")}: ${result.Wilayah}\n` +
                    `❖ ${formatter.bold("Tanggal")}: ${result.Tanggal}\n` +
                    `❖ ${formatter.bold("Potensi")}: ${result.Potensi}\n` +
                    `❖ ${formatter.bold("Magnitude")}: ${result.Magnitude}\n` +
                    `❖ ${formatter.bold("Kedalaman")}: ${result.Kedalaman}\n` +
                    `❖ ${formatter.bold("Koordinat")}: ${result.Coordinates}\n` +
                    `❖ ${formatter.bold("Dirasakan")}: ${result.Dirasakan}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};