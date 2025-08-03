module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx?.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "halo, dunia!"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru.", `Gunakan ${formatter.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`]))
        );

        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            let blacklist = await db.get("bot.blacklistBroadcast") || [];

            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                await db.set("bot.blacklistBroadcast", blacklist);
                return await ctx.reply(formatter.quote("✅ Grup ini telah dihapus dari blacklist broadcast"));
            } else {
                blacklist.push(ctx.id);
                await db.set("bot.blacklistBroadcast", blacklist);
                return await ctx.reply(formatter.quote("✅ Grup ini telah ditambahkan ke blacklist broadcast"));
            }
        }

        try {
            const groupIds = Object.values(await ctx.core.groupFetchAllParticipating()).map(g => g.id);
            const blacklist = await db.get("bot.blacklistBroadcast") || [];
            const filteredGroupIds = groupIds.filter(groupId => !blacklist.includes(groupId));

            const waitMsg = await ctx.reply(formatter.quote(`🔄 Mengirim siaran ke ${filteredGroupIds.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(filteredGroupIds.length * 0.5 * 1000)}`));

            const delay = ms => new Promise(res => setTimeout(res, ms));
            const failedGroupIds = [];
            for (const groupId of filteredGroupIds) {
                await delay(500);
                try {
                    const contextInfo = {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: config.bot.newsletterJid,
                            newsletterName: config.bot.name
                        },
                        externalAdReply: {
                            title: config.bot.name,
                            body: config.bot.version,
                            mediaType: 1,
                            thumbnailUrl: config.bot.thumbnail,
                            renderLargerThumbnail: true
                        }
                    };

                    await ctx.sendMessage(groupId, {
                        text: input,
                        contextInfo
                    }, {
                        quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.footer)
                    });
                } catch (error) {
                    failedGroupIds.push(groupId);
                }
            }
            const successCount = filteredGroupIds.length - failedGroupIds.length;

            return await ctx.editMessage(waitMsg.key, formatter.quote(`✅ Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup, ${blacklist.length} grup dalam blacklist tidak dikirim.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};