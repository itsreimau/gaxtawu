const util = require("node:util");

module.exports = {
    name: /^==> |^=> /,
    type: "hears",
    code: async (ctx) => {
        if (!ctx.citation.isOwner) return;

        try {
            const code = ctx.msg.content.slice(ctx.msg.content.startsWith("==> ") ? 4 : 3);
            const result = await eval(ctx.msg.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);

            await ctx.reply(formatter.monospace(util.inspect(result)));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false, false);
        }
    }
};