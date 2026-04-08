module.exports = {
	name: "listpendingmembers",
	aliases: ["pendingmembers"],
	category: "group",
	permissions: {
		admin: true,
		botAdmin: true,
		group: true,
	},
	code: async (ctx) => {
		try {
			const pending = await ctx.group().pendingMembers();
			const resultText = pending
				.map((member) => `➛ ${ctx.getId(member.id)}`)
				.join("\n");

			await ctx.reply(
				resultText.trim() ||
					`ⓘ ${formatter.italic(config.msg.notFound)}`
			);
		} catch (error) {
			await tools.cmd.handleError(ctx, error);
		}
	},
};
