const axios = require("axios");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"],
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
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/SazumiVicky/cek-khodam/main/khodam/list.txt", {});
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.trim().split("\n").filter(Boolean));

            return await ctx.reply({
                text: `${formatter.quote(`Nama: ${input}`)}\n` +
                    formatter.quote(`Khodam: ${result}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
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