module.exports = [{
    name: "mute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "bot") {
            const groupDb = ctx.db.group;
            groupDb.mutebot = true;
            await groupDb.save();
            return await ctx.reply(tools.msg.info("Berhasil me-mute grup ini dari bot!"));
        }

        const target = await ctx.target(["quoted", "mentioned"]);
        const daysAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    tools.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target.",
                        `Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(tools.msg.info("Durasi mute (dalam hari) harus lebih dari 0!"));
        if (tools.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(tools.msg.info(`Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-mute bot.`));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("Dia adalah owner grup!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const existingMute = muteList.find(m => m.jid === target.jid);
            if (existingMute) return await ctx.reply(tools.msg.info("Pengguna sudah di-mute sebelumnya!"));

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                muteList.push({
                    jid: target.jid,
                    expiration: expirationDate
                });

                groupDb.mute = muteList;
                await groupDb.save();

                await ctx.reply(tools.msg.info(`Berhasil me-mute pengguna itu selama ${daysAmount} hari!`));
            } else {
                muteList.push({
                    jid: target.jid,
                    expiration: null
                });

                groupDb.mute = muteList;
                await groupDb.save();

                await ctx.reply(tools.msg.info("Berhasil me-mute pengguna itu!"));
            }
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
}, {
    name: "unmute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "bot") {
            const groupDb = ctx.db.group;
            groupDb.mutebot = false;
            await groupDb.save();
            return await ctx.reply(tools.msg.info("Berhasil me-unmute grup ini dari bot!"));
        }

        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Balas/quote pesan untuk menjadikan pengirim sebagai akun target.",
                        `Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (tools.helper.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(tools.msg.info(`Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("Dia adalah owner grup!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const index = muteList.findIndex(m => m.jid === target.jid);
            if (index === -1) return await ctx.reply(tools.msg.info("Pengguna tidak ditemukan dalam daftar mute!"));

            muteList.splice(index, 1);
            groupDb.mute = muteList;
            await groupDb.save();

            await ctx.reply(tools.msg.info("Berhasil me-unmute pengguna itu dari grup ini!"));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
}];