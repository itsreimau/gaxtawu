module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcht", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${formatter.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`
                ])
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
            const groupIds = (Object.values(await ctx.core.groupFetchAllParticipating()).map(group => group.id)).filter(groupId => !blacklist.includes(groupId));
            const waitMsg = await ctx.reply(`ⓘ ${formatter.italic(`Mengirim siaran ke ${groupIds.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(groupIds.length * 0.5 * 1000)}`)}`);
            for (const groupId of groupIds) {
                let mentions = [];
                if (ctx.used.command === "bcht") {
                    const members = await ctx.group(groupId).members();
                    mentions = members.map(member => member.jid);
                }
                await ctx.core.sendMessage(groupId, {
                    text: input,
                    contextInfo: {
                        mentionedJid: mentions,
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
                await tools.cmd.delay(500);
            }

            await ctx.editMessage(waitMsg.key, `ⓘ ${formatter.italic(`Berhasil mengirim ke ${groupIds.length} grup.`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};