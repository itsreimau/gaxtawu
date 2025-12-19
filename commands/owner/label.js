module.exports = {
    name: "label",
    aliases: ["tag"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "bot wangsaf")
            );

        if (input.length > 30) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 30 karakter!")}`);

        try {
            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(config.msg.wait)}`);
            const groupIds = Object.values(await ctx.core.groupFetchAllParticipating()).map(group => group.id);
            for (const groupId of groupIds) {
                await ctx.core.relayMessage(groupId, {
                    protocolMessage: {
                        type: 30,
                        memberLabel: {
                            label: input
                        }
                    }
                }, {
                    additionalNodes: [{
                        tag: "meta",
                        attrs: {
                            tag_reason: "user_update",
                            appdata: "member_tag"
                        },
                        content: undefined
                    }]
                });
            }

            await ctx.editMessage(waitMsg.key, `ⓘ ${formatter.italic(`Label bot berhasil diubah menjadi ${formatter.inlineCode(input)} di ${groupIds.length} grup!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false);
        }
    }
};