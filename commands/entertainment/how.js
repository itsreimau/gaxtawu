module.exports = {
    name: "how",
    aliases: ["howgay", "howpintar", "howcantik", "howganteng", "howgabut", "howgila", "howlesbi", "howstress", "howbucin", "howjones", "howsadboy"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (ctx.used.command === "how" || input?.toLowerCase() === "list") {
            const listText = await tools.list.get("how");
            return await ctx.reply(listText);
        }

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "itsreimau")}\n` +
            tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`])
        );

        try {
            const randomNumber = Math.floor(Math.random() * 100);

            await ctx.reply(`${input} itu ${randomNumber}% ${ctx.used.command.replace("how", "")}.`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};