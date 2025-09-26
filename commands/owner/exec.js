const { exec } = require("node:child_process");
const util = require("node:util");

module.exports = {
    name: /^\$ /,
    type: "hears",
    code: async (ctx) => {
        if (!ctx.citation.isOwner) return;

        try {
            const command = ctx.msg.content.slice(2);
            const output = await util.promisify(exec)(command);

            await ctx.reply(formatter.monospace(output.stdout || output.stderr));
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false, false);
        }
    }
};