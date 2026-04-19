module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcht", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${formatter.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`
                ])
            );

        const botDb = ctx.db.bot;
        let blacklist = botDb?.blacklistBroadcast || [];

        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(`ⓘ ${formatter.italic("Grup ini telah dihapus dari blacklist broadcast")}`);
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(`ⓘ ${formatter.italic("Grup ini telah ditambahkan ke blacklist broadcast")}`);
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(`Mengirim siaran ke ${groupJids.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(groupJids.length * 1.5 * 1000)}`)}`);
            for (const groupJid of groupJids) {
                await ctx.sendMessage(groupJid, {
                    image: {
                        url: config.bot.thumbnail
                    },
                    caption: input,
                    mentionAll: ctx.used.command === "bcht" ? true : false,
                    footer: config.msg.footer,
                    buttons: [{
                        text: "Hubungi Owner",
                        id: `${ctx.used.prefix}owner`
                    }, {
                        text: "Donasi",
                        id: `${ctx.used.prefix}donate`
                    }]
                });
                await tools.cmd.delay(1000);
            }

            await ctx.editMessage(ctx.id, waitMsg.key, `ⓘ ${formatter.italic(`Berhasil mengirim ke ${groupJids.length} grup.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};