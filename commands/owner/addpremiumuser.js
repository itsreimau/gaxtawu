const { Baileys } = require("@itsreimau/gktw");

module.exports = {
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = await ctx.quoted?.senderLid() || await ctx.convertJid(ctx.getMentioned()[0], "lid") || (ctx.args[0] ? await ctx.convertJid(ctx.args[0].replace(/[^\d]/g, "") + Baileys.S_WHATSAPP_NET, "lid") : null);
        const daysAmount = parseInt(ctx.args[ctx.quoted ? 0 : 1], 10) || null;

        if (!userJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "@0 30"))}\n` +
                `${formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan pengirim sebagai akun target."]))}\n` +
                formatter.quote(tools.msg.generatesFlagInfo({
                    "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
                })),
            mentions: [0 + Baileys.S_WHATSAPP_NET]
        });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(formatter.quote("❎ Durasi Premium (dalam hari) harus diisi dan lebih dari 0!"));

        try {
            const userId = ctx.getId(userJid);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });

            const silent = flag?.silent || false;

            await db.set(`user.${userId}.premium`, true);
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                await db.set(`user.${userId}.premiumExpiration`, expirationDate);

                if (!silent) await ctx.sendMessage(userJid, {
                    text: formatter.quote(`📢 Anda telah ditambahkan sebagai pengguna Premium oleh Owner selama ${daysAmount} hari!`)
                });

                await ctx.reply(formatter.quote(`✅ Berhasil menambahkan Premium selama ${daysAmount} hari kepada pengguna itu!`));
            } else {
                await db.delete(`user.${userId}.premiumExpiration`);

                if (!silent) await ctx.sendMessage(userJid, {
                    text: formatter.quote("📢 Anda telah ditambahkan sebagai pengguna Premium selamanya oleh Owner!")
                });

                await ctx.reply(formatter.quote("✅ Berhasil menambahkan Premium selamanya kepada pengguna itu!"));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};