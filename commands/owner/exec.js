const util = require("node:util");
const { exec } = require("node:child_process");

module.exports = {
    name: /^\$ /,
    type: "hears",
    code: async (ctx) => {
        if (!ctx.sender.isOwner()) return;

        try {
            const command = ctx.msg.body.slice(2);
            const output = await promisify(exec)(command);

            await ctx.reply(ctx.text.monospace(output.stdout || output.stderr));
        } catch (error) {
            await ctx.helper.handleError(ctx, error, false, true);
        }
    }
};