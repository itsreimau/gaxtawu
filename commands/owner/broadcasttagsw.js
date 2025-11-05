const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    name: "broadcasttagsw",
    aliases: ["bctagsw"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru.", `Gunakan ${formatter.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`])
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image", "gif", "video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image", "gif", "video"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image", "gif", "video"]));

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
            const groupIds = (Object.values(await ctx.core.groupFetchAllParticipating()).map(group => group.id)).filter(groupId => !blacklist.includes(groupId));
            const failedGroupIds = [];

            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(`Mengirim siaran ke ${groupIds.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(groupIds.length * 0.5 * 1000)}`)}`);

            for (let i = 0; i < groupIds.length; i += 5) {
                await delay(500);

                const batch = groupIds.slice(i, i + 5);
                const mediaType = checkMedia || checkQuotedMedia;
                const buffer = await ctx.msg.download() || await ctx.quoted.download();

                try {
                    await ctx.core.sendStatusMentions({
                        [mediaType]: buffer,
                        caption: input
                    }, batch);
                } catch (error) {
                    failedGroupIds.push(groupId);
                }
            }
            const successCount = groupIds.length - failedGroupIds.length;

            await ctx.editMessage(waitMsg.key, `ⓘ ${formatter.italic(`Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup, ${blacklist.length} grup dalam blacklist tidak dikirim.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};