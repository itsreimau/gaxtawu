module.exports = {
    name: "claim",
    aliases: ["bonus", "klaim"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "daily"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        const claim = claimRewards[input];
        const senderId = ctx.getId(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};
        const level = userDb?.level || 0;

        if (!claim) return await ctx.reply(formatter.quote("❎ Hadiah tidak valid!"));
        if (tools.cmd.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(formatter.quote("❎ Kamu sudah memiliki koin tak terbatas, tidak perlu mengklaim lagi."));
        if (level < claim.level) return await ctx.reply(formatter.quote(`❎ Kamu perlu mencapai level ${claim.level} untuk mengklaim hadiah ini. Levelmu saat ini adalah ${level}.`));

        const currentTime = Date.now();

        const lastClaim = (userDb?.lastClaim ?? {})[input] || 0;
        const timePassed = currentTime - lastClaim;
        const remainingTime = claim.cooldown - timePassed;
        if (remainingTime > 0) return await ctx.reply(formatter.quote(`⏳ Kamu telah mengklaim hadiah ${input}. Tunggu ${tools.msg.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const rewardCoin = (userDb?.coin || 0) + claim.reward;
            await db.set(`user.${senderId}.coin`, rewardCoin);
            await db.set(`user.${senderId}.lastClaim.${input}`, currentTime);

            await ctx.reply(formatter.quote(`✅ Kamu berhasil mengklaim hadiah ${input} sebesar ${claim.reward} koin! Koin-mu saat ini adalah ${rewardCoin}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};

// Daftar hadiah klaim yang tersedia
const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000, // 24 jam (100 koin)
        level: 1
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000, // 7 hari (500 koin)
        level: 15
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000, // 30 hari (2000 koin)
        level: 50
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000, // 365 hari (10000 koin)
        level: 75
    }
};