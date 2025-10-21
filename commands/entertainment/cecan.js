module.exports = {
    name: "cecan",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("cecan");
            return await ctx.reply({
                text: listText
            });
        }

        try {
            const listCecan = ["china", "indonesia", "japan", "korea", "thailand", "vietnam"];
            const cecan = listCecan.includes(input) ? input : tools.cmd.getRandomElement(listCecan);
            const result = tools.api.createUrl("nekolabs", `/random/girl/${cecan}`);

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("Kategori")}: ${tools.msg.ucwords(cecan)}`,
                buttons: [{
                    buttonId: input ? `${ctx.used.prefix + ctx.used.command} ${input}` : ctx.used.prefix + ctx.used.command,
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