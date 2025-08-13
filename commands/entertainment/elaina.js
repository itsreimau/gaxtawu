module.exports = {
    name: "elaina",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("hang", "/random/elaina");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: formatter.quote("Sou, Watashi desu!"),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};