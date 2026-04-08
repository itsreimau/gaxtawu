const axios = require("axios");

module.exports = {
	name: "weather",
	aliases: ["cuaca"],
	category: "tool",
	permissions: {
		coin: 5,
	},
	code: async (ctx) => {
		const input = ctx.text;

		if (!input)
			return await ctx.reply(
				`${tools.msg.generateInstruction(["send"], ["text"])}\n` +
					tools.msg.generateCmdExample(ctx.used, "bogor")
			);

		try {
			const apiUrl = tools.api.createUrl(
				"zflorynz",
				"/api/search/cuaca",
				{
					text: input,
				}
			);
			const result = (await axios.get(apiUrl)).data.result;

			await ctx.reply(
				`➛ ${formatter.bold("Lokasi")}: ${result.lokasi}\n` +
					`➛ ${formatter.bold("Cuaca")}: ${tools.msg.ucwords(result.cuaca)}\n` +
					`➛ ${formatter.bold("Suhu")}: ${result.suhu}\n` +
					`➛ ${formatter.bold("Kelembaban")}: ${result.kelembapan}\n` +
					`➛ ${formatter.bold("Angin")}: ${result.angin}\n` +
					`➛ ${formatter.bold("Tekanan Udara")}: ${result.cuaca.tekanan_udara}`
			);
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
