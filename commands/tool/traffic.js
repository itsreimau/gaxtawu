module.exports = {
    name: "traffic",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || tools.cmd.extractUrlFromText(ctx.quoted?.body);

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(tools.msg.info(config.msg.invalidUrl));

        try {
            const apiUrl = tools.api.createUrl("sanka", "/tools/traffic", {
                sites: url
            }, "apikey");
            const result = (await axios.get(apiUrl)).data.result.data[0];

            await ctx.reply(
                `❖ ${formatter.bold("Situs")}: ${result.site}\n` +
                `❖ ${formatter.bold("Trafik")}: ${new Intl.NumberFormat('id-ID').format(result.traffic)}\n` +
                `❖ ${formatter.bold("Trafik Bulan Ini")}: ${result.month_traffic}\n` +
                `❖ ${formatter.bold("Rank")}: #${result.global_rank} global, #${result.country_rank} country\n` +
                `❖ ${formatter.bold("Waktu di Situs")}: ${tools.msg.convertMsToDuration(Math.round(result.time_on_site * 1000))}\n` +
                `❖ ${formatter.bold("Halaman/Kunjungan")}: ${result.page_per_visit.toFixed(2)}\n` +
                `❖ ${formatter.bold("Bounce Rate")}: ${(result.bounce_rate * 100).toFixed(2)}%\n` +
                "\n" +
                `✦ — ${formatter.bold("Sumber Trafik")}\n` +
                `❖ Direct: ${(result.traffic_source_direct * 100).toFixed(2)}%\n` +
                `❖ Sosial: ${(result.traffic_source_social * 100).toFixed(2)}%\n` +
                `❖ Email: ${(result.traffic_source_mail * 100).toFixed(2)}%\n` +
                `❖ Pencarian: ${(result.traffic_source_search * 100).toFixed(2)}%\n` +
                `❖ Referral Berbayar: ${(result.traffic_source_paid_referral * 100).toFixed(2)}%`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};