module.exports = {
    name: "galau",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("vreden", "/api/galau");

            await ctx.reply({
                video: {
                    url: result
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: formatter.quote("Take care of yourself."),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};