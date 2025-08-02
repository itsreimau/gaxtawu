module.exports = {
    name: "robohash",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))
        );

        try {
            const result = tools.api.createUrl("archive", "/api/maker/robohash", {
                username: input
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Username: ${input}`),
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