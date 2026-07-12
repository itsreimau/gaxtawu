module.exports = {
    name: "kodepos",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "bogor")
            );

        try {
            const apiUrl = tools.api.createUrl("alwayscodex", "/api/tools/kodepos", {
                location: input
            });
            const result = (await axios.get(apiUrl)).data.result.data;

            const resultText = result.map(res =>
                `❖ ${formatter.bold("Kode Pos")}: ${res.kodepos}\n` +
                `❖ ${formatter.bold("Desa")}: ${res.desa}\n` +
                `❖ ${formatter.bold("Kecamatan")}: ${res.kecamatan}\n` +
                `❖ ${formatter.bold("Kota")}: ${res.kota}\n` +
                `❖ ${formatter.bold("Provinsi")}: ${res.provinsi}`
            ).join("\n\n");
            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};