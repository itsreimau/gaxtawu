module.exports = {
    name: "join",
    aliases: ["j"],
    category: "owner",
    permissions: {
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, config.bot.groupLink)
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(tools.msg.info(config.msg.urlInvalid));

        try {
            const urlCode = new URL(url).pathname.split("/").pop();
            await ctx.groups.acceptInvite(urlCode).then(async (res) => {
                if (res)
                    await ctx.sendMessage(res, {
                        image: {
                            url: config.bot.thumbnail
                        },
                        caption: `>ᴗ< ${formatter.italic(`Halo! Saya adalah bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)}`,
                        location: {
                            degreesLatitude: 0,
                            degreesLongitude: 0,
                            name: config.bot.name,
                            address: "Jangan lupa berdonasi agar bot tetap online.",
                            jpegThumbnail: await tools.cmd.getJpegThumbnail(config.bot.thumbnail)
                        },
                        buttons: [{
                            text: "Menu",
                            id: `${ctx.used.prefix}menu`
                        }, {
                            text: "Hubungi Owner",
                            id: `${ctx.used.prefix}owner`
                        }, {
                            text: "Donasi",
                            id: `${ctx.used.prefix}donate`
                        }]
                    });
            });

            await ctx.reply(tools.msg.info("Berhasil bergabung dengan grup!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};