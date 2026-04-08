module.exports = {
	name: "afk",
	category: "profile",
	code: async (ctx) => {
		const input = ctx.text;

		try {
			const senderDb = ctx.db.user;
			senderDb.afk = {
				reason: input,
				timestamp: Date.now(),
			};
			senderDb.save();

			await ctx.reply(
				`ⓘ ${formatter.italic(`Anda akan AFK, ${input ? `dengan alasan ${formatter.inlineCode(input)}` : "tanpa alasan apapun"}.`)}`
			);
		} catch (error) {
			await tools.cmd.handleError(ctx, error);
		}
	},
};
