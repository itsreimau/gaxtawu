const util = require("node:util");

module.exports = {
	name: /^==> |^=> /,
	type: "hears",
	code: async (ctx) => {
		if (!ctx.sender.isOwner()) return;

		try {
			const code = ctx.msg.body.slice(
				ctx.msg.body.startsWith("==> ") ? 4 : 3
			);
			const result = await eval(
				ctx.msg.body.startsWith("==> ")
					? `(async () => { ${code} })()`
					: code
			);

			await ctx.reply(formatter.monospace(util.format(result)));
		} catch (error) {
			await tools.cmd.handleError(ctx, error, false, true);
		}
	},
};
