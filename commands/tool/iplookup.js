module.exports = {
    name: "iplookup",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "1.1.1.1")
            );

        try {
            const apiUrl = tools.api.createUrl("sanka", "/tools/iplookup", {
                q: input
            }, "apikey");
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply(
                `❖ ${formatter.bold("IP Address")}: ${result.ip_address}\n` +
                `❖ ${formatter.bold("Hostname")}: ${result.hostname}\n` +
                `❖ ${formatter.bold("Lokasi")}: ${result.city}, ${result.region}, ${result.country}\n` +
                `❖ ${formatter.bold("Koordinat")}: ${result.latitude}, ${result.longitude}\n` +
                `❖ ${formatter.bold("Organisasi")}: ${result.organization}\n` +
                `❖ ${formatter.bold("Kode Pos")}: ${result.postal_code}\n` +
                `❖ ${formatter.bold("Zona Waktu")}: ${result.timezone}`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};