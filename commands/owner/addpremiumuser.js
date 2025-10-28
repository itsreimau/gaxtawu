const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const targetJid = ctx.quoted?.sender || ctx.getMentioned()[0] || (ctx.args[0] ? (await ctx.core.getLidUser(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET))[0].lid : null);
        const daysAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!targetJid) return await ctx.reply({
            text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 30")}\n` +
                `${tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                }),
            mentions: ["6281234567891@s.whatsapp.net"]
        });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(`ⓘ ${formatter.italic("Durasi premium (dalam hari) harus diisi dan lebih dari 0!")}`);

        try {
            const targetDb = ctx.getDb("users", targetJid);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;

            targetDb.premium = true;
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                targetDb.premiumExpiration = expirationDate;
                targetDb.save();

                if (!silent) await ctx.core.sendMessage(targetJid, {
                    text: `ⓘ ${formatter.italic(`Anda telah ditambahkan sebagai pengguna premium oleh owner selama ${daysAmount} hari!`)}`
                });

                await ctx.reply(`ⓘ ${formatter.italic(`Berhasil menambahkan premium selama ${daysAmount} hari kepada pengguna itu!`)}`);
            } else {
                delete targetDb?.premiumExpiration;
                targetDb.save();

                if (!silent) await ctx.core.sendMessage(targetJid, {
                    text: `ⓘ ${formatter.italic("Anda telah ditambahkan sebagai pengguna premium selamanya oleh owner!")}`
                });

                await ctx.reply(`ⓘ ${formatter.italic("Berhasil menambahkan premium selamanya kepada pengguna itu!")}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};