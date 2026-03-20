module.exports = {
    name: "label",
    aliases: ["tag"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "bot wangsaf")
            );

        if (input.length > 30) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 30 karakter!")}`);

        try {
            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(config.msg.wait)}`);
            const groupJids = (Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id));
            for (const groupJid of groupJids) {
                await ctx.core.updateMemberLabel(groupJid, input);
            }

            await ctx.editMessage(ctx.id, waitMsg.key, `ⓘ ${formatter.italic(`Label bot berhasil diubah menjadi ${formatter.inlineCode(input)} di ${groupJids.length} grup!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false);
        }
    }
};