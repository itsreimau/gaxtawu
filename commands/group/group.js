module.exports = {
    name: "group",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "open")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("group");
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
                    return await ctx.reply(`ⓘ ${formatter.italic(`Setelan "${input}" tidak valid!`)}`);
            }

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil mengubah setelan grup!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};