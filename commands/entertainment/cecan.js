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
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const listCecan = ["china", "indonesia", "japan", "korea", "thailand", "vietnam"];
            const cecan = listCecan.includes(input) ? input : tools.cmd.getRandomElement(listCecan);
            const result = tools.api.createUrl("siputzx", `/api/r/cecan/${cecan}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Kategori: ${tools.msg.ucwords(cecan)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: input ? `${ctx.used.prefix + ctx.used.command} ${input}` : ctx.used.prefix + ctx.used.command,
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