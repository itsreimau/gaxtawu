module.exports = {
    name: "mode",
    alises: ["m"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "self")}\n` +
                ctx.format.generateNotes([
                    `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "mode");
            return await ctx.reply(listText);
        }

        try {
            const botDb = ctx.db.bot;

            switch (input.toLowerCase()) {
                case "premium":
                case "group":
                case "private":
                case "public":
                case "self":
                    botDb.mode = input.toLowerCase();
                    botDb.save();
                    break;
                default:
                    return await ctx.reply(ctx.format.info(`Mode "${input}" tidak valid!`));
            }

            await ctx.reply(ctx.format.info(`Berhasil mengubah mode ke ${input}!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};