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
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                ctx.text.generateCmdExample(ctx.used, "bot wangsaf")
            );

        if (input.length > 30) return await ctx.reply(ctx.text.info("Maksimal 30 karakter!"));

        try {
            const waitMsg = await ctx.reply(ctx.text.info(config.msg.wait));
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            const {
                delay
            } = ctx.helper.calculateDelay(groupJids.length);
            for (const groupJid of groupJids) {
                try {
                    await ctx.core.updateMemberLabel(groupJid, input);
                    await ctx.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, ctx.text.info(`Label bot berhasil diubah menjadi ${ctx.text.inlineCode(input)} di ${groupJids.length} grup!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error, false);
        }
    }
};