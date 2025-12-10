module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru.", `Gunakan ${formatter.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`])
        );

        let blacklist = config.system?.blacklistBroadcast || [];
        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                config.system.blacklistBroadcast = blacklist;
                config.save();
                return await ctx.reply(`ⓘ ${formatter.italic("Grup ini telah dihapus dari blacklist broadcast")}`);
            } else {
                blacklist.push(ctx.id);
                config.system.blacklistBroadcast = blacklist;
                config.save();
                return await ctx.reply(`ⓘ ${formatter.italic("Grup ini telah ditambahkan ke blacklist broadcast")}`);
            }
        }

        try {
            const groupIds = Object.values(await ctx.core.groupFetchAllParticipating()).map(group => group.id);
            const filteredGroupIds = groupIds.filter(groupId => !blacklist.includes(groupId));

            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(`Mengirim siaran ke ${filteredGroupIds.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(filteredGroupIds.length * 0.5 * 1000)}`)}`);

            const delay = ms => new Promise(res => setTimeout(res, ms));
            const failedGroupIds = [];
            for (const groupId of filteredGroupIds) {
                await delay(500);
                try {
                    await ctx.core.sendMessage(groupId, {
                        text: input,
                        contextInfo: {
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.bot.newsletterJid,
                                newsletterName: config.msg.footer
                            },
                            externalAdReply: {
                                title: config.bot.name,
                                body: config.msg.note,
                                mediaType: 1,
                                thumbnailUrl: config.bot.thumbnail,
                                sourceUrl: config.bot.groupLink,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {
                        quoted: tools.cmd.fakeQuotedText(config.msg.footer)
                    });
                } catch (error) {
                    failedGroupIds.push(groupId);
                }
            }
            const successCount = filteredGroupIds.length - failedGroupIds.length;

            await ctx.editMessage(waitMsg.key, `ⓘ ${formatter.italic(`Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup, ${blacklist.length} grup dalam blacklist tidak dikirim.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};