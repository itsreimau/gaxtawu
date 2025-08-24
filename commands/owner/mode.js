module.exports = {
    name: "mode",
    alises: ["m"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "self"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("mode");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            switch (input.toLowerCase()) {
                case "group":
                case "private":
                case "public":
                case "self":
                    await db.set("bot.mode", input.toLowerCase());
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Mode "${input}" tidak valid!`));
            }

            await ctx.reply(formatter.quote(`✅ Berhasil mengubah mode ke ${input}!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};