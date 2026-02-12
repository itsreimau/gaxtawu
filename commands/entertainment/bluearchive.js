module.exports = {
    name: "bluearchive",
    aliases: ["ba"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("deline", "/random/ba");

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Kueri")}: Blue Archive`,
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