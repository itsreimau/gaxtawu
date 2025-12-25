module.exports = {
    name: "delsewagroup",
    aliases: ["delsewa", "delsewagrup", "dsg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = ctx.isGroup() ? ctx.id : await ctx.target(["text_group"]);

        if (!target)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "1234567890")}\n` +
                `${tools.msg.generateNotes(["Gunakan di grup untuk otomatis menghapus sewa grup tersebut."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })
            );

        if (!await ctx.group(target)) return await ctx.reply(`ⓘ ${formatter.italic("Grup tidak valid atau bot tidak ada di grup tersebut!")}`);

        try {
            const groupDb = ctx.getDb("users", target);

            delete groupDb.premium;
            delete groupDb.premiumExpiration;
            groupDb.save();

            const flag = ctx.flag({
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;
            const group = await ctx.group(target);
            const groupOwner = await group.owner();
            if (!silent && groupOwner) {
                const groupMentions = [{
                    groupJid: `${group.id}@g.us`,
                    groupSubject: await group.name()
                }];
                await ctx.core.sendMessage(groupOwner, {
                    text: `ⓘ ${formatter.italic(`Sewa bot untuk grup @${groupMentions.groupJid} telah dihentikan oleh owner!`)}`,
                    contextInfo: {
                        groupMentions
                    }
                });
            }

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil menghapus sewa bot untuk grup ini!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};