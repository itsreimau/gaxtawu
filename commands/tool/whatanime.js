const axios = require("axios");

module.exports = {
	name: "whatanime",
	aliases: ["wait"],
	category: "tool",
	permissions: {
		coin: 5,
	},
	code: async (ctx) => {
		const [checkMedia, checkQuotedMedia] = [
			tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
			tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"]),
		];

		if (!checkMedia && !checkQuotedMedia)
			return await ctx.reply(
				tools.msg.generateInstruction(["send", "reply"], ["image"])
			);

		try {
			const uploadUrl =
				(await ctx.msg.upload()) || (await ctx.quoted.upload());
			const apiUrl = tools.api.createUrl(
				"sanka",
				"/anime/what-anime",
				{
					url: uploadUrl,
				},
				"apikey"
			);
			const result = (await axios.get(apiUrl)).data.result;

			await ctx.reply(
				`➛ ${formatter.bold("Judul")}: ${result.title.english} (${result.title.romaji})\n` +
					`➛ ${formatter.bold("Genre")}: ${result.genres.join(", ")}`
			);
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
