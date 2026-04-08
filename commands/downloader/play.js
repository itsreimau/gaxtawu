const axios = require("axios");

module.exports = {
	name: "play",
	category: "downloader",
	permissions: {
		coin: 5,
	},
	code: async (ctx) => {
		const flag = ctx.flag({
			index: {
				type: "string",
				short: "i",
				default: "0",
			},
			source: {
				type: "string",
				short: "s",
				default: "youtube",
			},
		});
		const input = flag.input;

		if (!input)
			return await ctx.reply(
				`${tools.msg.generateInstruction(["send"], ["text"])}\n` +
					`${tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify")}\n` +
					tools.msg.generatesFlagInfo({
						"-i <number>": "Pilihan pada data indeks",
						"-s <text>":
							"Sumber untuk memutar lagu (tersedia: spotify, youtube | default: youtube)",
					})
			);

		try {
			const searchIndex = parseInt(flag.index, 10);
			const source = flag.source;

			if (source === "spotify") {
				const searchApiUrl = tools.api.createUrl(
					"kuroneko",
					"/api/search/spotify",
					{
						q: input,
					}
				);
				const searchResult = (await axios.get(searchApiUrl)).data
					.result[searchIndex];

				await ctx.reply(
					`➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
						`➛ ${formatter.bold("Artis")}: ${searchResult.artist}\n` +
						`➛ ${formatter.bold("URL")}: ${searchResult.track_url}`
				);

				const downloadApiUrl = tools.api.createUrl(
					"izukumii",
					"/downloader/spotify",
					{
						url: searchResult.url,
					}
				);
				const downloadResult = (await axios.get(downloadApiUrl)).data
					.result.download;

				await ctx.reply({
					audio: {
						url: downloadResult,
					},
					mimetype: tools.mime.lookup("mp3"),
				});
			} else {
				const searchApiUrl = tools.api.createUrl(
					"deline",
					"/search/youtube",
					{
						q: input,
					}
				);
				const searchResult = (await axios.get(searchApiUrl)).data
					.result[searchIndex];

				await ctx.reply(
					`➛ ${formatter.bold("Judul")}: ${searchResult.title}\n` +
						`➛ ${formatter.bold("Artis")}: ${searchResult.channel}\n` +
						`➛ ${formatter.bold("URL")}: ${searchResult.link}`
				);

				const downloadApiUrl = tools.api.createUrl(
					"nexray",
					"/downloader/ytmp3",
					{
						url: searchResult.link,
					}
				);
				const downloadResult = (await axios.get(downloadApiUrl)).data
					.result.url;

				await ctx.reply({
					audio: {
						url: downloadResult,
					},
					mimetype: tools.mime.lookup("mp3"),
				});
			}
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
