module.exports = [{
    name: "broadcastgc",
    aliases: ["bc", "bcht", "bcgc", "broadcast"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${tools.msg.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`
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
                return await ctx.reply(tools.msg.info("Grup ini telah dihapus dari blacklist broadcast"));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(tools.msg.info("Grup ini telah ditambahkan ke blacklist broadcast"));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            const {
                delay,
                duration
            } = tools.helper.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(tools.msg.info(`Mengirim siaran ke ${groupJids.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(duration)}`));
            for (const groupJid of groupJids) {
                try {
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
                    await tools.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, tools.msg.info(`Berhasil mengirim ke ${groupJids.length} grup.`));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
}, {
    name: "broadcastgcsw",
    aliases: ["bcgcsw", "bcswgc"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        const [checkMedia, checkQuotedMedia] = [
            tools.helper.checkMedia(ctx.msg.messageType, ["image", "video"]),
            tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["image", "video"])
        ];

        const type = checkMedia || checkQuotedMedia;

        if (!input && !type)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "halo, dunia!")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${tools.msg.inlineCode("blacklist")} untuk memasukkan grup ke dalam blacklist. (Hanya berfungsi pada grup)`
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
                return await ctx.reply(tools.msg.info("Grup ini telah dihapus dari blacklist broadcast"));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(tools.msg.info("Grup ini telah ditambahkan ke blacklist broadcast"));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
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
            const {
                delay,
                duration
            } = tools.helper.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(tools.msg.info(`Mengirim siaran ke ${groupJids.length} grup, perkiraan waktu: ${tools.msg.convertMsToDuration(duration)}`));
            for (const groupJid of groupJids) {
                try {
                    await ctx.sendMessage(groupJid, {
                        ...content,
                        groupStatus: true
                    });
                    await tools.helper.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, tools.msg.info(`Berhasil mengirim ke ${groupJids.length} grup.`));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
}];