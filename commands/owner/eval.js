const util = require("node:util");

module.exports = {
    name: /^==> |^=> /,
    type: "hears",
    code: async (ctx) => {
        if (!ctx.sender.isOwner()) return;

        try {
            const code = ctx.msg.text.slice(ctx.msg.text.startsWith("==> ") ? 4 : 3);
            const result = await eval(ctx.msg.text.startsWith("==> ") ? `(async () => { ${code} })()` : code);

            await ctx.reply(formatter.monospace(util.format(result)));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false, false);
        }
    }
};