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
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        try {
            const randomNumber = Math.floor(Math.random() * 100);

            await ctx.reply(formatter.quote(`${input} itu ${randomNumber}% ${(ctx.used.command.replace("how", ""))}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};