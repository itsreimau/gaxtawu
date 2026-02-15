module.exports = {
    name: "broadcasttagsw",
    aliases: ["bctagsw"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, "image", "video"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, "image", "video")
        ];

        const type = checkMedia || checkQuotedMedia;

        if (!input && !type)
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
            const groupJids = (Object.values(await ctx.core.groupFetchAllParticipating()).map(group => group.id)).filter(groupJid => !blacklist.includes(groupJid));
            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(`Mengirim siaran ke ${groupJids.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(groupJids.length * 0.5 * 1000)}`)}`);
            for (const groupJid of groupJids) {
                let content;
                if (["image", "video"].includes(type)) {
                    const buffer = await ctx.msg.download() || await ctx.quoted.download();
                    content = {
                        [type]: buffer,
                        caption: input
                    };
                } else {
                    content = {
                        text: input
                    };
                }
                await ctx.reply({
                    groupStatus: content
                });
                await tools.cmd.delay(500);
            }

            await ctx.editMessage(waitMsg.key, `ⓘ ${formatter.italic(`Berhasil mengirim ke ${successCount} grup.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};