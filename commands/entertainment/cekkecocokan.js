const axios = require("axios");

module.exports = {
    name: "cekkecocokan",
    aliases: ["checkkecocokan", "kecocokan"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "shinji|kaworu"))
        );

        try {
            const [nama1, nama2] = input.split("|");
            const apiUrl = tools.api.createUrl("siputzx", "/api/primbon/kecocokan_nama_pasangan", {
                nama1: nama2 ? nama1 : ctx.sender.pushName,
                nama2: nama2 || nama1
            });
            const result = (await axios.get(apiUrl)).data.data;

            await ctx.reply({
                image: {
                    url: result.gambar
                },
                mimetype: tools.mime.lookup("png"),
                caption: `${formatter.quote(`Sisi Positif: ${result.sisi_positif}`)}\n` +
                    formatter.quote(`Sisi Negatif: ${result.sisi_negatif}`),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};