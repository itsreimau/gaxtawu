module.exports = {
    name: "label",
    category: "misc",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "halo, dunia!")
        );

        if (input.length > 30) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 30 kata!")}`);

        try {
            await ctx.core.relayMessage(ctx.id, {
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
                    content: null
                }]
            });

            await ctx.reply(`ⓘ ${formatter.italic(`Label bot berhasil diubah menjadi ${formatter.inlineCode(input)}!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error, false);
        }
    }
};