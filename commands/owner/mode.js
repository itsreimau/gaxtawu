module.exports = {
    name: "mode",
    alises: ["m"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "self")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("mode");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "premium":
                case "group":
                case "private":
                case "public":
                case "self":
                    config.system.mode = input.toLowerCase();
                    config.save();
                    break;
                default:
                    return await ctx.reply(`ⓘ ${formatter.italic(`Mode "${input}" tidak valid!`)}`);
            }

            await ctx.reply(`ⓘ ${formatter.italic(`Berhasil mengubah mode ke ${input}!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};