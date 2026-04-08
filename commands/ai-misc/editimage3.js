module.exports = {
	name: "editimage3",
	aliases: ["editimg3"],
	category: "ai-misc",
	permissions: {
		coin: 5,
	},
	code: async (ctx) => {
		const input = ctx.text;

		if (!input)
			return await ctx.reply(
				`${tools.msg.generateInstruction(["send"], ["text"])}\n` +
					tools.msg.generateCmdExample(
						ctx.used,
						"make it evangelion art style"
					)
			);

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
			const result = tools.api.createUrl(
				"sanka",
				"/ai/editimg",
				{
					url: uploadUrl,
					prompt: input,
				},
				"apikey"
			);

			await ctx.reply({
				image: {
					url: result,
				},
				mimetype: tools.mime.lookup("png"),
			});
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
