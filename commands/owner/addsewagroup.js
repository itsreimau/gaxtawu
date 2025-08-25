const {
    Baileys
} = require("@itsreimau/gktw");

module.exports = {
    name: "addsewagroup",
    aliases: ["addsewa", "addsewagrup", "adg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup() ? ctx.id : (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Baileys.G_US : null);
        const daysAmount = parseInt(ctx.args[ctx.isGroup() ? 0 : 1], 10) || null;

        if (!groupJid) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "1234567890 30"))}\n` +
            `${formatter.quote(tools.msg.generateNotes(["Gunakan di grup untuk otomatis menyewakan grup tersebut."]))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
            }))
        );

        if (!await ctx.group(groupJid)) return await ctx.reply(formatter.quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));
        if (daysAmount && daysAmount <= 0) return await ctx.reply(formatter.quote("❎ Durasi sewa (dalam hari) harus diisi dan lebih dari 0!"));

        try {
            const groupId = ctx.getId(groupJid);

            await db.set(`group.${groupId}.sewa`, true);

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
                    groupJid: `${group.id}@g.us`,
                    groupSubject: await group.name()
                }];
            }

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                await db.set(`group.${groupId}.sewaExpiration`, expirationDate);

                if (!silent && groupOwner) await ctx.sendMessage(groupOwner, {
                    text: formatter.quote(`📢 Bot berhasil disewakan ke grup @${groupMentions.groupJid} selama ${daysAmount} hari!`),
                    contextInfo: {
                        groupMentions
                    }
                });

                await ctx.reply(formatter.quote(`✅ Berhasil menyewakan bot ke grup ${ctx.isGroup() ? "ini" : "itu"} selama ${daysAmount} hari!`));
            } else {
                await db.delete(`group.${groupId}.sewaExpiration`);

                if (!silent && groupOwner) await ctx.sendMessage(groupOwner, {
                    text: formatter.quote(`📢 Bot berhasil disewakan ke grup @${groupMentions.groupJid} selamanya!`),
                    contextInfo: {
                        groupMentions
                    }
                });

                await ctx.reply(formatter.quote(`✅ Berhasil menyewakan bot ke grup ${ctx.isGroup() ? "ini" : "itu"} selamanya!`));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};