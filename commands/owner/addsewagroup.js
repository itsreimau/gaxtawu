const { Gktw } = require("@itsreimau/gktw");

module.exports = {
    name: "addsewagroup",
    aliases: ["addsewa", "addsewagrup", "adg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup() ? ctx.id : (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Gktw.G_US : null);
        const daysAmount = parseInt(ctx.args[ctx.isGroup() ? 0 : 1], 10) || null;

        if (!groupJid) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "1234567890 30")}\n` +
            `${tools.msg.generateNotes(["Gunakan di grup untuk otomatis menyewakan grup tersebut."])}\n` +
            tools.msg.generatesFlagInfo({
                "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
            })
        );

        if (!await ctx.group(groupJid)) return await ctx.reply(`ⓘ ${formatter.italic("Grup tidak valid atau bot tidak ada di grup tersebut!")}`);
        if (daysAmount && daysAmount <= 0) return await ctx.reply(`ⓘ ${formatter.italic("Durasi sewa (dalam hari) harus diisi dan lebih dari 0!")}`);

        try {
            const senderDb = ctx.getDb("groups", groupJid);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;

            const group = await ctx.group(groupJid);
            const groupOwner = await group.owner();

            if (!silent && groupOwner) {
                const groupMentions = [{
                    groupJid: group.id + Gktw.G_US,
                    groupSubject: await group.name()
                }];
            }

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                groupDb.sewaExpiration = expirationDate;
                groupDb.save();

                if (!silent && groupOwner) await ctx.core.sendMessage(groupOwner, {
                    text: `ⓘ ${formatter.italic(`Bot berhasil disewakan ke grup @${groupMentions.groupJid} selama ${daysAmount} hari!`)}`,
                    contextInfo: {
                        groupMentions
                    }
                });

                await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menyewakan bot ke grup ${ctx.isGroup() ? "ini" : "itu"} selama ${daysAmount} hari!`)}`);
            } else {
                delete groupDb?.sewaExpiration;
                groupDb.save();

                if (!silent && groupOwner) await ctx.core.sendMessage(groupOwner, {
                    text: `ⓘ ${formatter.italic(`Bot berhasil disewakan ke grup @${groupMentions.groupJid} selamanya!`)}`,
                    contextInfo: {
                        groupMentions
                    }
                });

                await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menyewakan bot ke grup ${ctx.isGroup() ? "ini" : "itu"} selamanya!`)}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};