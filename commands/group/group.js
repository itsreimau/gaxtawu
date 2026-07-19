module.exports = {
    name: "group",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.text.generateCmdExample(ctx.used, "open")}\n` +
                ctx.text.generateNotes([
                    `Ketik ${ctx.text.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "group");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "open":
                case "close":
                case "lock":
                case "unlock":
                    await ctx.group()[input.toLowerCase()]();
                    break;
                case "approve":
                    await ctx.group().joinApproval("on");
                    break;
                case "disapprove":
                    await ctx.group().joinApproval("off");
                    break;
                case "invite":
                    await ctx.group().membersCanAddMemberMode("on");
                    break;
                case "restrict":
                    await ctx.group().membersCanAddMemberMode("off");
                    break;
                default:
                    return await ctx.reply(ctx.text.info(`Setelan "${input}" tidak valid!`));
            }

            await ctx.reply(ctx.text.info("Berhasil mengubah setelan grup!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};