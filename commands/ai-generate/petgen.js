const axios = require("axios");

module.exports = {
	name: "petgen",
	category: "ai-generate",
	permissions: {
		coin: 5,
	},
	code: async (ctx) => {
		const input = ctx.text || ctx.quoted?.text;

		if (!input)
			return await ctx.reply(
				`${tools.msg.generateInstruction(["send"], ["text"])}\n` +
					tools.msg.generateCmdExample(
						ctx.used,
						"anime girl with short blue hair"
					)
			);

		try {
			const apiUrl = tools.api.createUrl("zflorynz", "/api/ai/petimg", {
				prompt: input,
			});
			const result = (await axios.get(apiUrl)).data.url;

			await ctx.reply({
				image: {
					url: result,
				},
				mimetype: tools.mime.lookup("png"),
				caption: `➛ ${formatter.bold("Prompt")}: ${input}`,
				buttons: [
					{
						buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
						buttonText: {
							displayText: "Ambil Lagi",
						},
					},
				],
			});
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
