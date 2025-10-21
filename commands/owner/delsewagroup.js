const { Gktw } = require("@itsreimau/gktw");

module.exports = {
    name: "delsewagroup",
    aliases: ["delsewa", "delsewagrup", "dsg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup() ? ctx.id : (ctx.args[0] ? ctx.args[0].replace(/[^\d]/g, "") + Gktw.G_US : null);

        if (!groupJid) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "1234567890")}\n` +
            `${tools.msg.generateNotes(["Gunakan di grup untuk otomatis menghapus sewa grup tersebut."])}\n` +
            tools.msg.generatesFlagInfo({
                "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
            })
        );

        if (!await ctx.group(groupJid)) return await ctx.reply(`ⓘ ${formatter.italic("Grup tidak valid atau bot tidak ada di grup tersebut!")}`);

        try {
            const groupDb = ctx.getDb("users", groupJid);

            delete groupDb.premium;
            delete groupDb.premiumExpiration;
            groupDb.save();

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
                await ctx.sendMessage(groupOwner, {
                    text: `ⓘ ${formatter.italic(`Sewa bot untuk grup @${groupMentions.groupJid} telah dihentikan oleh Owner!`)}`,
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