module.exports = {
    name: "join",
    aliases: ["j"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, config.bot.groupLink)
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const urlCode = new URL(url).pathname.split("/").pop();
            await ctx.groups.acceptInvite(urlCode).then(async (res) => {
                await ctx.core.sendMessage(res, {
                    text: `>ᴗ< ${formatter.italic(`Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)}`,
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
                });
            });

            await ctx.reply(`ⓘ ${formatter.italic("Berhasil bergabung dengan grup!")}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};